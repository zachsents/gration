import { createHash, randomBytes } from "crypto"
import { CALLBACK_URL, parseScopes } from "./util.js"
import { Timestamp } from "firebase-admin/firestore"
import _ from "lodash"


/**
 * @typedef {object} URLs
 * @property {string} authorize
 * @property {string} token
 * @property {string} userInfo
 * @property {string} revoke
 */


export class AuthService {

    /**
     * @param {string} serviceId
     * 
     * @param {object} options
     * @param {string} options.name
     * @param {string} [options.baseUrl] If provided, will be used to construct the auth and token URLs using 
     * default paths of /authorize and /token.
     * @param {URLs} [options.urls]
     * @param {boolean} [options.usePKCE=false]
     * @param {boolean} [options.ignorePKCEMismatch=false]
     * @param {string} [options.debugPrefix]
     * @param {(userInfo: object) => string} [options.selectUserId]
     * @param {boolean} [options.expectRefreshToken=true]
     * @param {boolean} [options.fetchUserInfoOnCallback=true]
     * @param {boolean} [options.passClientCredentialsAsParameters=false]
     * @param {string[]} [options.scopes]
     */
    constructor(serviceId, {
        name,
        baseUrl,
        urls,
        usePKCE = false,
        ignorePKCEMismatch = false,
        debugPrefix = "",
        selectUserId = (account) => account.userData?.id || account.userData?.sub,
        expectRefreshToken = true,
        fetchUserInfoOnCallback = true,
        passClientCredentialsAsParameters = false,
        scopes = [],
    } = {}) {
        this.serviceId = serviceId
        this.name = name
        this.usePKCE = usePKCE
        this.ignorePKCEMismatch = ignorePKCEMismatch

        /** @type {URLs} */
        this.urls = urls || {}
        if (baseUrl) {
            this.urls.authorize ||= `${baseUrl}/authorize`
            this.urls.token ||= `${baseUrl}/token`
        }

        this.debugPrefix = debugPrefix
        this.selectUserId = selectUserId
        this.expectRefreshToken = expectRefreshToken
        this.fetchUserInfoOnCallback = fetchUserInfoOnCallback
        this.passClientCredentialsAsParameters = passClientCredentialsAsParameters
        this.scopes = scopes
    }

    /**
     * @param {object} options
     * @param {import("./util.js").ServiceClient} options.serviceClient
     * @param {import("firebase-functions/v2/https").Request} options.request
     * @param {string} options.state
     * @returns {Promise<{ url: string, additionalState: object }>}
     */
    async generateAuthUrl({ serviceClient, request, state }) {

        if (this.usePKCE) {
            var codeVerifier = randomBytes(64).toString("base64url")
            var codeChallenge = hashCodeVerifier(codeVerifier)
        }

        const params = new URLSearchParams({
            client_id: serviceClient.clientId,
            redirect_uri: CALLBACK_URL,
            response_type: "code",
            scope: [...new Set([
                ...serviceClient.scopes,
                ...parseScopes(request.query.scopes),
                ...this.scopes,
            ])].join(" "),
            state,
            ...this.usePKCE && {
                code_challenge: codeChallenge,
                code_challenge_method: "S256",
            },
        })

        return {
            url: `${this.urls.authorize}?${params.toString()}`,
            additionalState: {
                ...this.usePKCE && { codeVerifier },
            },
        }
    }

    /**
     * @param {object} options
     * @param {import("./util.js").ServiceClient} options.serviceClient
     * @param {import("firebase-functions/v2/https").Request} options.request
     * @param {import("./util.js").AuthState} options.authState
     * @returns {Promise<{ id: string, data: import("./util.js").ConnectedAccount }>}
     */
    async handleCallback({ serviceClient, request, authState }) {

        if (request.query.error)
            throw new Error(request.query.error_description || request.query.error || "Unknown error")

        if (this.usePKCE && !this.ignorePKCEMismatch && request.query.code_challenge != hashCodeVerifier(authState.codeVerifier))
            throw new Error("Code challenge doesn't match")

        const tokenResponse = await fetch(this.urls.token, {
            method: "POST",
            headers: {
                ...(!this.passClientCredentialsAsParameters && basicAuthorizationHeader(serviceClient)),
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            body: new URLSearchParams({
                code: request.query.code,
                redirect_uri: CALLBACK_URL,
                grant_type: "authorization_code",
                ...(this.usePKCE && { code_verifier: authState.codeVerifier }),
                ...(this.passClientCredentialsAsParameters && {
                    client_id: serviceClient.clientId,
                    client_secret: serviceClient.clientSecret,
                }),
            }).toString()
        }).then(parseResponse)

        if (tokenResponse.error)
            throw new Error(tokenResponse.error_description || tokenResponse.error || "Unknown error")

        const userData = this.fetchUserInfoOnCallback ?
            await this.getUserInfo(tokenResponse.access_token) :
            {}

        const accountData = {
            accessToken: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token,
            tokenType: tokenResponse.token_type,
            expiresAt: tokenResponse.expires_in ?
                new Date(Date.now() + tokenResponse.expires_in * 1000) :
                null,
            refreshExpiresAt: tokenResponse.refresh_expires_in ?
                new Date(Date.now() + tokenResponse.refresh_expires_in * 1000) :
                tokenResponse.refresh_token ? null : undefined,
            tokenData: _.omit(tokenResponse, ["access_token", "refresh_token", "token_type", "expires_in", "refresh_expires_in"]),
            userData,
        }

        const accountId = this.selectUserId(accountData)?.toString()
        if (!accountId) {
            this.debug("No user ID found", accountData)
            throw new Error("Couldn't determine user ID")
        }

        return { id: accountId, data: accountData }
    }

    /**
     * @param {object} options
     * @param {import("./util.js").ServiceClient} options.serviceClient
     * @param {import("./util.js").ConnectedAccount} options.connectedAccount
     * @returns {Promise<{ data: { accessToken: string, expiresAt: Date }, checked: boolean }>}
     */
    async getFreshToken({ serviceClient, connectedAccount }) {

        const connectedAccountExpiresAt = connectedAccount.expiresAt?.toDate()

        const isExpired = connectedAccount.expiresAt === null ? false :
            (connectedAccountExpiresAt < Date.now() + 5 * 60 * 1000)

        if (!isExpired) {

            if (isWithinCachedTimePeriod(connectedAccount.checkedAt)) {
                this.debug("Authorized! (cached check in last 5 mins)")
                return {
                    checked: false,
                    data: {
                        accessToken: connectedAccount.accessToken,
                        expiresAt: connectedAccountExpiresAt,
                    },
                }
            }

            const isGood = await this.getUserInfo(connectedAccount.accessToken)
                .then(() => true)
                .catch(() => false)

            if (isGood) {
                this.debug("Authorized! (via whoami)")
                return {
                    checked: true,
                    data: {
                        accessToken: connectedAccount.accessToken,
                        expiresAt: connectedAccountExpiresAt,
                    },
                }
            }
        }

        if (!connectedAccount.refreshToken)
            throw new Error("No refresh token")

        const tokenInfo = await fetch(this.urls.token, {
            method: "POST",
            headers: {
                ...(!this.passClientCredentialsAsParameters && basicAuthorizationHeader(serviceClient)),
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            body: new URLSearchParams({
                refresh_token: connectedAccount.refreshToken,
                grant_type: "refresh_token",
                ...(this.passClientCredentialsAsParameters && {
                    client_id: serviceClient.clientId,
                    client_secret: serviceClient.clientSecret,
                }),
            }).toString()
        }).then(parseResponse)

        if (tokenInfo.error)
            throw new Error(tokenInfo.error_description || tokenInfo.error || "Unknown error")

        this.debug("Authorized! (via refesh)")
        return {
            checked: true,
            data: {
                accessToken: tokenInfo.access_token,
                refreshToken: tokenInfo.refresh_token,
                expiresAt: tokenInfo.expires_in &&
                    new Date(Date.now() + tokenInfo.expires_in * 1000),
                refreshExpiresAt: tokenInfo.refresh_expires_in &&
                    new Date(Date.now() + tokenInfo.refresh_expires_in * 1000),
            },
        }
    }

    /**
     * @param {string} accessToken
     */
    async getUserInfo(accessToken) {
        const userInfo = await fetch(this.urls.userInfo, {
            headers: bearerAuthorizationHeader(accessToken)
        }).then(res => res.json())

        if (userInfo.error)
            throw new Error(userInfo.error_description || userInfo.error || "Unknown error")

        return userInfo
    }

    debug(...args) {
        console.debug(this.debugPrefix, ...args)
    }
}


function hashCodeVerifier(codeVerifier) {
    return createHash("sha256").update(codeVerifier).digest("base64url")
}


/**
 * @param {import("./util.js").ServiceClient} serviceClient
 */
function basicAuthorizationHeader(serviceClient) {
    return {
        "Authorization": "Basic " + Buffer.from(`${serviceClient.clientId}:${serviceClient.clientSecret}`).toString("base64"),
    }
}


function bearerAuthorizationHeader(accessToken) {
    return {
        "Authorization": "Bearer " + accessToken,
    }
}


function isWithinCachedTimePeriod(timestamp, cacheTimeMins = 5) {
    let timestampMs
    if (timestamp instanceof Date)
        timestampMs = timestamp.getTime()
    else if (typeof timestamp === "number")
        timestampMs = timestamp
    else if (timestamp instanceof Timestamp)
        timestampMs = timestamp.toMillis()
    else
        return false

    return timestampMs > Date.now() - cacheTimeMins * 60 * 1000
}


/**
 * @param {Response} res
 */
async function parseResponse(res) {
    return res.ok ? res.json() : res.text().then(text => Promise.reject(text))
}