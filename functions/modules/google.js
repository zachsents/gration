import { google } from "googleapis"
import { parseScopes } from "./util.js"



/**
 * @param {import("../index.js").ServiceClient} serviceClient
 * @returns {import("googleapis").Auth.OAuth2Client}
 */
export function getOAuth2Client(serviceClient) {
    return new google.auth.OAuth2({
        clientId: serviceClient.clientId,
        clientSecret: serviceClient.clientSecret,
        redirectUri: "http://127.0.0.1:5001/gration-f5cd8/us-central1/HandleOAuth2Callback",
    })
}


export async function handleOAuth2Callback({ request, serviceClient }) {
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
}


/**
 * @param {object} params
 * @param {import("../index.js").ServiceClient} params.serviceClient
 * @param {*} params.connectedAccount
 */
export async function getFreshToken({ serviceClient, connectedAccount }) {

    const client = getOAuth2Client(serviceClient)
    client.setCredentials({ refresh_token: connectedAccount.refreshToken })

    const { token: accessToken } = await client.getAccessToken()
    const tokenInfo = await client.getTokenInfo(accessToken)

    return {
        accessToken,
        expiresAt: new Date(tokenInfo.expiry_date),
    }
}