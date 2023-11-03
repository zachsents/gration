import { AuthService } from "../modules/AuthService.js"


export default new AuthService("slack-bot", {
    name: "Slack (Bot)",
    baseUrl: "https://slack.com/oauth/v2",
    debugPrefix: "Slack (Bot)",
    urls: {
        token: "https://slack.com/api/oauth.v2.access",
        userInfo: "https://slack.com/api/bots.info",
    },
    expectRefreshToken: false,
    selectUserId: (account) => account.tokenData.bot_user_id,
    fetchUserInfoOnCallback: false,
    scopes: ["users:read"],
})
