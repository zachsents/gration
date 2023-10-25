import express from "express"
import { onRequest } from "firebase-functions/v2/https"
import morgan from "morgan"
import { CONNECTED_ACCOUNTS_SUBCOLLECTION, SERVICE_CLIENTS_COLLECTION } from "shared/firestore.js"
import { db } from "./init.js"
import { getAuthService } from "./modules/util.js"


const app = express()

app.use(morgan("dev"))

app.get("/serviceClient/:serviceClientId/listAccountsForUser/:appUserId", authenticateKey, listAccountsForUser)
app.get("/api/serviceClient/:serviceClientId/listAccountsForUser/:appUserId", authenticateKey, listAccountsForUser)

app.get("/serviceClient/:serviceClientId/getTokenForAccount/:connectedAccountId", authenticateKey, getTokenForAccount)
app.get("/api/serviceClient/:serviceClientId/getTokenForAccount/:connectedAccountId", authenticateKey, getTokenForAccount)


/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function listAccountsForUser(req, res) {
    const { serviceClientId, appUserId } = req.params

    if (!appUserId)
        return res.status(400).send("App user ID is required")

    const connectedAccounts = await db.collection(SERVICE_CLIENTS_COLLECTION).doc(serviceClientId)
        .collection(CONNECTED_ACCOUNTS_SUBCOLLECTION)
        .where("appUsers", "array-contains", appUserId)
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.id))

    res.send(connectedAccounts)
}


/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getTokenForAccount(req, res) {
    const { serviceClientId, connectedAccountId } = req.params

    if (!connectedAccountId)
        return res.status(400).send("Connected account ID is required")

    const connectedAccountRef = db.collection(SERVICE_CLIENTS_COLLECTION).doc(serviceClientId)
        .collection(CONNECTED_ACCOUNTS_SUBCOLLECTION).doc(connectedAccountId)
    const connectedAccount = await connectedAccountRef.get()
        .then(snapshot => snapshot.data())

    if (!connectedAccount)
        return res.status(404).send(`Connected account ${connectedAccountId} not found`)

    const authService = getAuthService(req.serviceClient.serviceId)

    if (!authService)
        return res.status(501).send("Not implemented")

    const tokenData = await authService.getFreshToken({
        serviceClient: req.serviceClient,
        connectedAccount,
    })

    await connectedAccountRef.update(tokenData)

    res.send(tokenData)
}


/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
async function authenticateKey(req, res, next) {
    const authHeader = req.header("authorization")

    if (!authHeader)
        return res.status(401).send("Authorization header is required")

    if (!authHeader.startsWith("Bearer "))
        return res.status(401).send("Authorization header must be a bearer token")

    const key = authHeader.split(" ")[1]

    if (!req.params.serviceClientId)
        return res.status(400).send("Service client ID is required")

    /** @type {import("./index.js").ServiceClient} */
    const serviceClient = await db.collection(SERVICE_CLIENTS_COLLECTION).doc(req.params.serviceClientId).get()
        .then(snapshot => snapshot.data())

    if (!serviceClient)
        return res.status(404).send(`Service client ${req.params.serviceClientId} not found`)

    if (serviceClient.secretKey !== key)
        return res.status(401).send("Invalid key")

    req.serviceClient = serviceClient

    next()
}

export const api = onRequest(app)