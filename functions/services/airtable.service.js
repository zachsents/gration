import { AuthService } from "../modules/AuthService.js"


export default new AuthService("airtable", {
    baseUrl: "https://airtable.com/oauth2/v1",
    useCodeChallenge: true,
    debugPrefix: "Airtable",
    urls: {
        userInfo: "https://api.airtable.com/v0/meta/whoami",
        revoke: "https://airtable.com/",
    },
})

