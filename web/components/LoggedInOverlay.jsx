import { LoadingOverlay } from "@mantine/core"
import { useUser } from "reactfire"


export default function LoggedInOverlay() {

    const { data: user } = useUser()

    return (
        <LoadingOverlay
            loaderProps={{ variant: "bars" }}
            overlayColor="#fff"
            overlayOpacity={1}
            visible={user === undefined}
        />
    )
}
