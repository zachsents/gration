import { Group, Text } from "@mantine/core"
import Link from "next/link"


export default function Brand() {


    return (
        <Link href="/" className="no-underline">
            <Group className="gap-xs bg-white rounded-md px-xs py-1">
                <img src="/logo.svg" alt="WoahAuth logo" className="h-10" />
                <Text className="font-bold text-xl text-pg-900">WoahAuth</Text>
            </Group>
        </Link>
    )
}
