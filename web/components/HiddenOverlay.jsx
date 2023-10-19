import { ActionIcon, Button, Center, Overlay } from "@mantine/core"
import { useState } from "react"
import { TbEye, TbEyeOff } from "react-icons/tb"


export default function HiddenOverlay({ children, ...props }) {

    const [hidden, setHidden] = useState(true)

    return (
        <div className="relative" >
            {children}
            {hidden ?
                <Overlay {...props} blur={10} opacity={0}>
                    <Center className="h-full w-full">
                        <Button
                            compact color="pg" onClick={() => setHidden(false)}
                            leftIcon={<TbEye />}
                        >
                            Reveal
                        </Button>
                    </Center>
                </Overlay> :
                <ActionIcon className="absolute top-2 right-2" onClick={() => setHidden(true)}>
                    <TbEyeOff />
                </ActionIcon>}
        </div>
    )
}
