import { randomUUID, createHash } from "crypto"


export function parseScopes(str) {
    return str?.split(/[,\s]+/g).filter(Boolean) || []
}

export function generateKey() {
    return createHash("sha256").update(randomUUID()).digest("hex")
}