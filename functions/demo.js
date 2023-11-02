import { defineSecret } from "firebase-functions/params"
import { onCall } from "firebase-functions/v2/https"


const demoSecret = defineSecret("LIVE_DEMO_SECRET_KEY")

export const GetDemoToken = onCall({
    secrets: [demoSecret],
}, async req => {

    console.log("Demo token requested by", req.data.userId)

    const connectedAccountIds = await fetch("https://woahauth.com/api/serviceClient/aRgMiBgrS2LyeUUn44p6/listAccountsForUser/" + req.data.userId, {
        headers: {
            "Authorization": "Bearer " + demoSecret.value(),
        }
    }).then(res => res.json())

    if (connectedAccountIds.length === 0)
        return null

    const tokenInfo = await fetch("https://woahauth.com/api/serviceClient/aRgMiBgrS2LyeUUn44p6/getTokenForAccount/" + connectedAccountIds[0], {
        headers: {
            "Authorization": "Bearer " + demoSecret.value(),
        }
    }).then(res => res.json())

    return tokenInfo
}) 