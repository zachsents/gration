import { FieldValue } from "firebase-admin/firestore"
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https"
import Joi from "joi"
import { AUTH_STATE_COLLECTION, CONNECTED_ACCOUNTS_SUBCOLLECTION, SERVICE_CLIENTS_COLLECTION } from "shared/firestore.js"
import { SERVICE, SERVICE_AUTH_TYPE } from "shared/services.js"
import { db } from "./init.js"
import * as google from "./modules/google.js"
import { generateKey, parseScopes } from "./modules/util.js"


/**
 * Returns a list of all available services.
 */
export const GetServices = onCall(callablePipeline(
    requireAuth(),
    () => Object.values(SERVICE),
))


/**
 * Registers a new OAuth2 client for the given service.
 */
export const RegisterOAuth2Client = onCall(callablePipeline(
    requireAuth(),
    validateSchema(Joi.object({
        serviceId: Joi.string().valid(...Object.values(SERVICE).map(service => service.id)).required(),
        clientId: Joi.string().required(),
        clientSecret: Joi.string().required(),
        nickname: Joi.string(),
        scopes: Joi.array().items(Joi.string()),
    })),
    async ({ data, auth }) => {
        const service = Object.values(SERVICE).find(service => service.id === data.serviceId)
        data.nickname ||= `${service.name} Client`
        data.scopes ||= []

        const isClientIdAlreadyRegistered = await db
            .collection(SERVICE_CLIENTS_COLLECTION)
            .where("clientId", "==", data.clientId)
            .limit(1).get()
            .then(snapshot => !snapshot.empty)

        if (isClientIdAlreadyRegistered)
            throw new HttpsError("already-exists", `Client ID ${data.clientId} is already registered`)

        const { id } = await db.collection(SERVICE_CLIENTS_COLLECTION).add({
            ...data,
            createdAt: FieldValue.serverTimestamp(),
            owner: auth?.uid,
            authType: SERVICE_AUTH_TYPE.OAUTH2,
            secretKey: generateKey(),
        })

        return { serviceClientId: id }
    },
))


/**
 * Updates the client secret for the given OAuth2 client.
 */
export const UpdateOAuth2ClientSecret = onCall(callablePipeline(
    requireAuth(),
    validateSchema(Joi.object({
        serviceClientId: Joi.string().required(),
        clientSecret: Joi.string().required(),
    })),
    async ({ data, auth }) => {
        const serviceClientRef = db.collection(SERVICE_CLIENTS_COLLECTION).doc(data.serviceClientId)
        const serviceClient = await serviceClientRef.get().then(snapshot => snapshot.data())

        if (!serviceClient)
            throw new HttpsError("not-found", `Service client ${data.serviceClientId} not found`)

        if (serviceClient.owner !== auth?.uid)
            throw new HttpsError("permission-denied", `Service client ${data.serviceClientId} is owned by another user`)

        if (serviceClient.authType !== SERVICE_AUTH_TYPE.OAUTH2)
            throw new HttpsError("failed-precondition", `Service client ${data.serviceClientId} is not an OAuth2 client`)

        await serviceClientRef.update({ clientSecret: data.clientSecret })
    },
))


/**
 * Creates a new secret key for the given OAuth2 client. Does not
 * return the new secret key.
 */
export const RollOAuth2SecretKey = onCall(callablePipeline(
    requireAuth(),
    validateSchema(Joi.object({
        serviceClientId: Joi.string().required(),
    })),
    async ({ data, auth }) => {
        const serviceClientRef = db.collection(SERVICE_CLIENTS_COLLECTION).doc(data.serviceClientId)
        const serviceClient = await serviceClientRef.get().then(snapshot => snapshot.data())

        if (!serviceClient)
            throw new HttpsError("not-found", `Service client ${data.serviceClientId} not found`)

        if (serviceClient.owner !== auth?.uid)
            throw new HttpsError("permission-denied", `Service client ${data.serviceClientId} is owned by another user`)

        if (serviceClient.authType !== SERVICE_AUTH_TYPE.OAUTH2)
            throw new HttpsError("failed-precondition", `Service client ${data.serviceClientId} is not an OAuth2 client`)

        await serviceClientRef.update({ secretKey: generateKey() })
    },
))


export const AuthorizeOAuth2User = onRequest(async (req, res) => {
    const serviceClientId = req.params[0]

    if (!serviceClientId)
        return res.status(400).send("Service client ID is required")

    /** @type {ServiceClient} */
    const serviceClient = await db.collection(SERVICE_CLIENTS_COLLECTION).doc(serviceClientId).get().then(snapshot => snapshot.data())

    if (!serviceClient)
        return res.status(404).send(`Service client ${serviceClientId} not found`)

    if (serviceClient.authType !== SERVICE_AUTH_TYPE.OAUTH2)
        return res.status(400).send(`Service client ${serviceClientId} is not an OAuth2 client`)

    const authStateRef = db.collection(AUTH_STATE_COLLECTION).doc()
    await authStateRef.set({
        serviceClientId,
        appUserId: req.query.user,
        createdAt: FieldValue.serverTimestamp(),
    })

    switch (serviceClient.serviceId) {
        case SERVICE.GOOGLE.id:
            res.redirect(
                google.getOAuth2Client(serviceClient).generateAuthUrl({
                    access_type: "offline",
                    scope: [...new Set([...serviceClient.scopes, ...parseScopes(req.query.scopes)])],
                    state: authStateRef.id,
                    include_granted_scopes: true,
                })
            )
            return
    }

    res.status(501).send("Not implemented")
})


export const HandleOAuth2Callback = onRequest(async (req, res) => {

    if (!req.query.code || !req.query.state)
        return res.status(400).send("Malformed request")

    /** @type {AuthState} */
    const authState = await db.collection(AUTH_STATE_COLLECTION).doc(req.query.state).get()
        .then(snapshot => snapshot.data())

    const serviceClientRef = db.collection(SERVICE_CLIENTS_COLLECTION).doc(authState.serviceClientId)
    /** @type {ServiceClient} */
    const serviceClient = await serviceClientRef.get().then(snapshot => snapshot.data())

    let connectedAccount
    switch (serviceClient.serviceId) {
        case SERVICE.GOOGLE.id:
            connectedAccount = await google.handleOAuth2Callback({ request: req, serviceClient })
            break
        default:
            return res.status(501).send("Not implemented")
    }

    await serviceClientRef.collection(CONNECTED_ACCOUNTS_SUBCOLLECTION).doc(connectedAccount.id).set({
        ...connectedAccount.data,
        updatedAt: FieldValue.serverTimestamp(),
        ...authState.appUserId && { appUsers: FieldValue.arrayUnion(authState.appUserId) },
    }, { merge: true })

    res.send("<script>window.close()</script><p>Logged in. You may close this window.</p>")
})


export * from "./api.js"


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
 * @typedef {object} AuthState
 * @property {string} serviceClientId - The ID of the service client that initiated the auth flow.
 * @property {string} appUserId - The ID of the app user that initiated the auth flow.
 * @property {import("firebase-admin/firestore").Timestamp} createdAt - The date this client was created.
 */


/**
 * @returns {CallableRequestHandler}
 */
function requireAuth() {
    return async request => {
        if (!request.auth)
            throw new HttpsError("unauthenticated", "Authentication required")
    }
}


/**
 * @param {Joi.Schema} schema
 * @returns {CallableRequestHandler}
 */
export function validateSchema(schema) {
    return async ({ data }) => {
        if (data === undefined)
            throw new HttpsError("invalid-argument", "Schema validation failed: data is undefined")

        try {
            return await schema.validateAsync(data)
        }
        catch (error) {
            throw new HttpsError("invalid-argument", error.message)
        }
    }
}


/**
 * @typedef {(request: import("firebase-functions/v2/https").CallableRequest) => Promise} CallableRequestHandler
 */


/**
 * Creates a callable function request handler that can take in
 * a pipeline of functions to run before the actual request handler.
 * @param {...CallableRequestHandler} functions
 * @returns {CallableRequestHandler}
 */
function callablePipeline(...functions) {
    return async (request) => {
        let result
        for (const func of functions)
            result = await func(request, result)
        return result
    }
}


