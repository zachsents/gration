import { AuthService } from "../modules/AuthService.js"


export default new AuthService("airtable", {
    name: "Airtable",
    baseUrl: "https://airtable.com/oauth2/v1",
    usePKCE: true,
    debugPrefix: "Airtable",
    urls: {
        userInfo: "https://api.airtable.com/v0/meta/whoami",
        revoke: "https://airtable.com/",
    },
    scopes: ["user.email:read"],
})

