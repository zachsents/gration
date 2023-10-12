
/**
 * @enum {string}
 */
export const SERVICE_AUTH_TYPE = {
    API_KEY: "api_key",
    OAUTH2: "oauth2",
}


/**
 * @enum {Service}
 */
export const SERVICE = {
    GOOGLE: {
        id: "google",
        name: "Google",
        authType: SERVICE_AUTH_TYPE.OAUTH2,
    },
    AIRTABLE: {
        id: "airtable",
        name: "Airtable",
        authType: SERVICE_AUTH_TYPE.OAUTH2,
    },
    OPENAI: {
        id: "openai",
        name: "OpenAI",
        authType: SERVICE_AUTH_TYPE.API_KEY,
    },
    STRIPE: {
        id: "stripe",
        name: "Stripe",
        authType: SERVICE_AUTH_TYPE.API_KEY,
    },
}

/**
 * @typedef {Object} Service
 * @property {string} id
 * @property {string} name
 * @property {string} authType
 */
