import { google } from "googleapis"
import { parseScopes } from "../modules/util.js"


/** @type {import("../modules/util.js").AuthService} */
export default {
    serviceId: "google",

    generateAuthUrl: async ({ serviceClient, request, state }) => {
        return getOAuth2Client(serviceClient).generateAuthUrl({
            access_type: "offline",
            scope: [...new Set([...serviceClient.scopes, ...parseScopes(request.query.scopes)])],
            state,
            include_granted_scopes: true,
        })
    },

    handleOAuth2Callback: async ({ serviceClient, request }) => {
        const client = getOAuth2Client(serviceClient)
        const { tokens } = await client.getToken(request.query.code)
        const tokenInfo = await client.getTokenInfo(tokens.access_token)

        return {
            id: tokenInfo.email || tokenInfo.user_id,
            data: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                scopes: parseScopes(tokens.scope),
                tokenType: tokens.token_type,
                idToken: tokens.id_token,
                expiresAt: new Date(tokens.expiry_date),
            },
        }
    },

    getFreshToken: async ({ serviceClient, connectedAccount }) => {
        const client = getOAuth2Client(serviceClient)
        client.setCredentials({ refresh_token: connectedAccount.refreshToken })

        const { token: accessToken } = await client.getAccessToken()
        const tokenInfo = await client.getTokenInfo(accessToken)

        return {
            accessToken,
            expiresAt: new Date(tokenInfo.expiry_date),
        }
    },
}


/**
 * @param {import("../index.js").ServiceClient} serviceClient
 * @returns {import("googleapis").Auth.OAuth2Client}
 */
function getOAuth2Client(serviceClient) {
    return new google.auth.OAuth2({
        clientId: serviceClient.clientId,
        clientSecret: serviceClient.clientSecret,
        redirectUri: "https://woahauth.com/oauth/callback",
    })
}