import express from "express"
import morgan from "morgan"
import { onRequest } from "firebase-functions/v2/https"
import { db } from "./init.js"
import { CONNECTED_ACCOUNTS_SUBCOLLECTION, SERVICE_CLIENTS_COLLECTION } from "shared/firestore.js"
import { SERVICE } from "shared/services.js"
import * as google from "./modules/google.js"


const app = express()

app.use(morgan("dev"))

app.get("/serviceClient/:serviceClientId/listAccountsForUser/:appUserId", authenticateKey, async (req, res) => {
    const { serviceClientId, appUserId } = req.params

    if (!appUserId)
        return res.status(400).send("App user ID is required")

    const connectedAccounts = await db.collection(SERVICE_CLIENTS_COLLECTION).doc(serviceClientId)
        .collection(CONNECTED_ACCOUNTS_SUBCOLLECTION)
        .where("appUsers", "array-contains", appUserId)
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.id))

    res.send(connectedAccounts)
})

app.get("/serviceClient/:serviceClientId/getTokenForAccount/:connectedAccountId", authenticateKey, async (req, res) => {
    const { serviceClientId, connectedAccountId } = req.params

    if (!connectedAccountId)
        return res.status(400).send("Connected account ID is required")

    const connectedAccount = await db.collection(SERVICE_CLIENTS_COLLECTION).doc(serviceClientId)
        .collection(CONNECTED_ACCOUNTS_SUBCOLLECTION).doc(connectedAccountId).get()
        .then(snapshot => snapshot.data())

    if (!connectedAccount)
        return res.status(404).send(`Connected account ${connectedAccountId} not found`)

    switch (req.serviceClient.serviceId) {
        case SERVICE.GOOGLE.id:
            return res.send(await google.getFreshToken({
                serviceClient: req.serviceClient,
                connectedAccount,
            }))
    }

    res.status(501).send("Not implemented")
})

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