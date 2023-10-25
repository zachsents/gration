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


/** @typedef {import("../index.js").ServiceClient} ServiceClient */
/** @typedef {import("firebase-functions/v2/https").Request} Request */


/** @typedef {(params: { request: Request, serviceClient: ServiceClient, state: string }) => Promise<string>} AuthServiceGenerateAuthUrlFunction */
/** @typedef {(params: { request: Request, serviceClient: ServiceClient }) => Promise<{ id: string, data: ConnectedAccount }>} AuthServiceHandleOAuth2CallbackFunction */
/** @typedef {(params: { serviceClient: ServiceClient, connectedAccount: ConnectedAccount }) => Promise<{ accessToken: string, expiresAt: Date }>} AuthServiceGetFreshTokenFunction */

/**
 * @typedef {object} AuthService
 * 
 * @property {string} serviceId
 * @property {AuthServiceGenerateAuthUrlFunction} generateAuthUrl
 * @property {AuthServiceHandleOAuth2CallbackFunction} handleOAuth2Callback
 * @property {AuthServiceGetFreshTokenFunction} getFreshToken
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