import { AuthService } from "../modules/AuthService.js"


export default new AuthService("linkedin", {
    name: "LinkedIn",
    baseUrl: "https://www.linkedin.com/oauth/v2",
    debugPrefix: "LinkedIn",
    urls: {
        authorize: "https://www.linkedin.com/oauth/v2/authorization",
        token: "https://www.linkedin.com/oauth/v2/accessToken",
        userInfo: "https://api.linkedin.com/v2/userinfo",
    },
    expectRefreshToken: false,
    passClientCredentialsAsParameters: true,
    scopes: ["openid", "profile", "email"],
    selectUserId: account => account.userData.sub,
})
