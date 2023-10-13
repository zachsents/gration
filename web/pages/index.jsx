import { Button } from "@mantine/core"
import { signOut, useMustBeSignedIn } from "@web/modules/firebase/auth"


export default function IndexPage() {

    useMustBeSignedIn()

    return (
        <div>
            <Button onClick={signOut}>Sign Out</Button>
        </div>
    )
}
