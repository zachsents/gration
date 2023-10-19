import { Anchor, Text } from "@mantine/core"
import ScopesInput from "./ScopesInput"


export default function OAuthClientScopesInput({ scopesListUrl, scopesList, ...props }) {
    return (
        <div>
            <Text className="text-sm">Requested Scopes</Text>
            <Text className="text-xs text-gray mb-1">
                You can find a <Anchor href={scopesListUrl} target="_blank">full list of scopes here.</Anchor>
            </Text>
            <ScopesInput
                data={scopesList}
                {...props}
            />
        </div>
    )
}
