import { FieldValue } from "firebase-admin/firestore"
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https"
import Joi from "joi"
import _ from "lodash"
import { AUTH_STATE_COLLECTION, CONNECTED_ACCOUNTS_SUBCOLLECTION, SERVICE_CLIENTS_COLLECTION } from "shared/firestore.js"
import { SERVICE_AUTH_TYPE } from "shared/services.js"
import { FREE_ACCOUNT_LIMIT } from "shared/stripe.js"
import { auth, db } from "./init.js"
import { generateSecretKey, getAccountUsage, getAuthService, getProductInfo } from "./modules/util.js"
import authServices from "./services/index.js"


/**
 * Returns a list of all available services.
 */
export const GetServices = onCall(callablePipeline(
    requireAuth(),
    () => authServices.map(service => _.pick(service, ["serviceId", "name"])),
))


/**
 * Registers a new OAuth2 client for the given service.
 */
export const RegisterOAuth2Client = onCall(callablePipeline(
    requireAuth(),
    validateSchema(Joi.object({
        serviceId: Joi.string().valid(...authServices.map(service => service.serviceId)).required(),
        clientId: Joi.string().required(),
        clientSecret: Joi.string().required(),
        nickname: Joi.string(),
        scopes: Joi.array().items(Joi.string()),
    })),
    async ({ data, auth }) => {
        const authService = getAuthService(data.serviceId)
        data.nickname ||= `${authService.name} Client`
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
            secretKey: generateSecretKey(),
        })

        return { serviceClientId: id }
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

        await serviceClientRef.update({ secretKey: generateSecretKey() })
    },
))


export const AuthorizeOAuth2User = onRequest(async (req, res) => {
    const serviceClientId = req.params[0].match(/\w+$/)?.[0]

    if (!serviceClientId)
        return res.status(400).send("Service client ID is required")

    /** @type {import("./modules/util.js").ServiceClient} */
    const serviceClient = await db.collection(SERVICE_CLIENTS_COLLECTION).doc(serviceClientId).get().then(snapshot => snapshot.data())

    if (!serviceClient)
        return res.status(404).send(`Service client ${serviceClientId} not found`)

    if (serviceClient.authType !== SERVICE_AUTH_TYPE.OAUTH2)
        return res.status(400).send(`Service client ${serviceClientId} is not an OAuth2 client`)

    const owner = await auth.getUser(serviceClient.owner)
    const stripeProduct = await getProductInfo(owner.customClaims.stripeRole)
    const accountLimit = stripeProduct ?
        parseInt(stripeProduct.metadata.accountLimit) :
        FREE_ACCOUNT_LIMIT
    const ownerUsage = await getAccountUsage(serviceClient.owner)

    if (ownerUsage >= accountLimit)
        return res.status(403).send("Account limit reached")

    const authService = getAuthService(serviceClient.serviceId)

    if (!authService)
        return res.status(501).send("Not implemented")

    const authStateRef = db.collection(AUTH_STATE_COLLECTION).doc()

    const { url, additionalState } = await authService.generateAuthUrl({
        request: req,
        serviceClient,
        state: authStateRef.id,
    })

    await authStateRef.set({
        serviceClientId,
        appUserId: req.query.user,
        createdAt: FieldValue.serverTimestamp(),
        ...additionalState,
    })

    return res.redirect(url)
})


export const HandleOAuth2Callback = onRequest(async (req, res) => {

    if (req.query.error)
        return res.status(400).send(req.query.error_description || req.query.error)

    if (!req.query.code || !req.query.state)
        return res.status(400).send("Malformed request")

    /** @type {import("./modules/util.js").AuthState} */
    const authState = await db.collection(AUTH_STATE_COLLECTION).doc(req.query.state).get()
        .then(snapshot => snapshot.data())

    const serviceClientRef = db.collection(SERVICE_CLIENTS_COLLECTION).doc(authState.serviceClientId)
    /** @type {import("./modules/util.js").ServiceClient} */
    const serviceClient = await serviceClientRef.get().then(snapshot => snapshot.data())

    if (!serviceClient)
        return res.status(404).send(`Service client ${authState.serviceClientId} not found`)

    const authService = getAuthService(serviceClient.serviceId)

    if (!authService)
        return res.status(501).send("Not implemented")

    const connectedAccount = await authService.handleOAuth2Callback({
        request: req,
        serviceClient,
        authState,
    })

    const connectedAccountRef = serviceClientRef.collection(CONNECTED_ACCOUNTS_SUBCOLLECTION)
        .doc(connectedAccount.id)

    if (authService.expectRefreshToken) {
        const isExisting = await connectedAccountRef.get().then(snapshot => snapshot.exists)

        if (!isExisting && !connectedAccount.data.refreshToken)
            return res.status(400).send(`The service didn't send the required information. This probably means you need to revoke the app's access to your account and try again.${authService.urls.revoke ? `<br><br><a href="${authService.urls.revoke}">Revoke access</a>` : ""}`)
    }

    await connectedAccountRef.set({
        ...connectedAccount.data,
        updatedAt: FieldValue.serverTimestamp(),
        ...authState.appUserId && { appUsers: FieldValue.arrayUnion(authState.appUserId) },
    }, { merge: true })

    res.send("<script>window.close()</script>Logged in. You may close this window.")
})


export const GetAccountsUsage = onCall(callablePipeline(
    requireAuth(),
    async request => getAccountUsage(request.auth.uid),
))


export * from "./api.js"


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
