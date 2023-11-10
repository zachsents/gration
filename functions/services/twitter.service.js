import { AuthService } from "../modules/AuthService.js"


export default new AuthService("twitter", {
    name: "Twitter",
    baseUrl: "https://api.twitter.com/2/oauth2",
    usePKCE: true,
    ignorePKCEMismatch: true,
    debugPrefix: "Twitter",
    urls: {
        authorize: "https://twitter.com/i/oauth2/authorize",
        userInfo: "https://api.twitter.com/2/users/me",
    },
    scopes: ["offline.access", "users.read"],
    selectUserId: account => account.userData.data?.id,
})

