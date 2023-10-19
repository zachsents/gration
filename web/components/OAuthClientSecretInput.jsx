import { Text, Textarea } from "@mantine/core"
import HiddenOverlay from "./HiddenOverlay"


export default function OAuthClientSecretInput({ sourceName, withOverlay = false, ...props }) {

    const textarea =
        <Textarea
            autosize minRows={3} maxRows={6}
            {...props}
        />

    return (
        <div>
            <Text className="text-sm">OAuth Client Secret</Text>
            <Text className="text-xs text-gray mb-1">
                Paste in your OAuth client secret from {sourceName}
            </Text>
            {withOverlay ?
                <HiddenOverlay className="rounded-md base-border">
                    {textarea}
                </HiddenOverlay> :
                textarea}
        </div>
    )
}
