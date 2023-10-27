import { AuthService } from "../modules/AuthService.js"


export default new AuthService("github", {
    baseUrl: "https://github.com/login/oauth",
    debugPrefix: "GitHub",
    urls: {
        token: "https://github.com/login/oauth/access_token",
        userInfo: "https://api.github.com/user",
    },
    expectRefreshToken: false,
})

