import { Text, TextInput } from "@mantine/core"


export default function OAuthClientIdInput({ sourceName, ...props }) {
    return (
        <div>
            <Text className="text-sm">OAuth Client ID</Text>
            <Text className="text-xs text-gray mb-1">
                Paste in your OAuth client ID from {sourceName}
            </Text>
            <TextInput {...props} />
        </div>
    )
}
