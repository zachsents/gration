import { randomBytes } from "crypto"


export function parseScopes(str) {
    return str?.split(/[,\s]+/g).filter(Boolean) || []
}

export function generateSecretKey() {
    return randomBytes(512 / 8).toString("base64url")
}