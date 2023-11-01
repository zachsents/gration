import { Button, Text } from "@mantine/core"
import Section, { SectionHeader } from "./Section"
import Link from "next/link"
import { useUser } from "reactfire"


export default function GraphicCTASection({ ...props }) {

    const { data: user } = useUser()

    return (
        <Section  {...props}>
            <SectionHeader className="mb-0">
                <Text className="uppercase text-primary-800 -mb-6">Ease of Use</Text>
                <h3 className="text-4xl font-bold">
                    Ready to get started?
                </h3>
                <Text className="text-xl">
                    Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated.
                </Text>
                <Button
                    size="lg" className="mt-10 rounded-lg scale-125 md:scale-100"
                    component={Link} href={user ? "/dashboard" : "/login?register"}
                >
                    Start now
                </Button>
            </SectionHeader>

            <div className="h-24 mt-10 md:h-64 md:-mt-4 flex justify-center overflow-clip">
                <img src="/graphics/plug-guy-long.png" alt="plug guy graphic" className="h-full" />
            </div>
        </Section>
    )
}
