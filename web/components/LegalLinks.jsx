import { Anchor, Group } from "@mantine/core"


export default function LegalLinks(props) {
    return (
        <Group {...props}>
            <Anchor
                href="/terms.html" target="_blank"
                className="text-xs text-gray"
            >
                Terms of Service
            </Anchor>
            <Anchor
                href="/privacy.html" target="_blank"
                className="text-xs text-gray"
            >
                Privacy
            </Anchor>
        </Group>
    )
}
