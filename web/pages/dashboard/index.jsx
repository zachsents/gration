import { Center, Stack, Text, Title } from "@mantine/core"
import DashboardShell from "@web/components/DashboardShell"
import Head from "next/head"


export default function DashboardIndexPage() {

    return (<>
        <Head>
            <title>Dashboard | WoahAuth</title>
        </Head>
        <DashboardShell>
            <Center className="w-full h-full">
                <Stack className="items-center">
                    <Title order={3} className="text-gray">Welcome to WoahAuth 😲</Title>
                    <Text className="text-center text-gray">
                        Select or create a service client on the left to get started.
                    </Text>
                </Stack>
            </Center>
        </DashboardShell>
    </>)
}
