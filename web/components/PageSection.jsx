import { Divider, Stack, Text } from "@mantine/core"


export default function PageSection({ children, title }) {


    return (
        <div>
            <Divider className="mb-2" />
            <Text className="text-xs font-bold uppercase text-gray">{title}</Text>

            <Stack className="mt-md">
                {children}
            </Stack>
        </div>
    )
}
