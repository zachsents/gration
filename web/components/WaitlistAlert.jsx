import { Alert } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useIsMobile } from "@web/modules/util"
import { useEffect } from "react"


export default function WaitlistAlert() {

    const isMobile = useIsMobile()

    useEffect(() => {
        if (isMobile) {
            notifications.clean()
            return
        }

        notifications.show({
            title: "We're accepting waitlisters!",
            message: "Sign in to automatically join the waitlist.",
            id: "waitlist-notification",
            autoClose: false,
            icon: "👋",
            color: "pg.2",
        })
    }, [isMobile])

    return isMobile &&
        <Alert title="We're accepting waitlisters!" icon="👋" color="pg" className="mb-sm">
            Sign in to automatically join the waitlist.
        </Alert>
}