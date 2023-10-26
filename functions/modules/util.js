import { randomBytes } from "crypto"
import authServices from "../services/index.js"


export function parseScopes(str) {
    return str?.split(/[,\s]+/g).filter(Boolean) || []
}

export function generateSecretKey() {
    return randomBytes(512 / 8).toString("base64url")
}

export function getAuthService(serviceId) {
    return authServices.find(service => service.serviceId === serviceId)
}


/** @typedef {import("firebase-functions/v2/https").Request} Request */


/**
 * @typedef {object} ServiceClient
 * @property {string} serviceId - The ID of the service this client is for.
 * @property {string} clientId - The OAuth client ID. This is from the service provider.
 * @property {string} clientSecret - The OAuth client secret. This is from the service provider.
 * @property {string} nickname - The nickname of this client.
 * @property {"oauth2" | "api_key"} authType - The type of authentication this client uses.
 * @property {string} owner - The ID of the user who owns this client.
 * @property {import("firebase-admin/firestore").Timestamp} createdAt - The date this client was created.
 * @property {string[]} scopes - The OAuth scopes this client has access to.
 * @property {string} secretKey - The secret key used to authenticate API requests.
 */


/**
 * @typedef {object} ConnectedAccount
 * 
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {string[]} scopes
 * @property {string} tokenType
 * @property {Date} expiresAt
 */


/**
 * @typedef {object} AuthState
 * @property {string} serviceClientId - The ID of the service client that initiated the auth flow.
 * @property {string} appUserId - The ID of the app user that initiated the auth flow.
 * @property {import("firebase-admin/firestore").Timestamp} createdAt - The date this client was created.
 */


export const CALLBACK_URL = "https://woahauth.com/oauth/callback"