import { Button, Center, Divider, Group, Stack, Text, ThemeIcon } from "@mantine/core"
import { useBillingLinks } from "@web/modules/stripe"
import classNames from "classnames"
import Link from "next/link"
import { TbCheck } from "react-icons/tb"
import { useUser } from "reactfire"
import Section, { SectionHeader } from "./Section"


export default function PricingSection() {

    return (
        <Section id="pricing">
            <SectionHeader>
                <Text className="uppercase text-primary-800 -mb-6">Pricing</Text>
                <h4 className="text-3xl font-bold">
                    Integrations affordable for everyone
                </h4>
                <Text className="text-xl">
                    Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated.
                </Text>
            </SectionHeader>

            <div className="grid grid-cols-3 gap-10">
                <PriceCard productName="starter" />
                <PriceCard productName="starter" recommended />
                <PriceCard productName="starter" />
            </div>
        </Section>
    )
}

function PriceCard({ productName, annual = false, recommended = false }) {

    const { data: user } = useUser()

    const [createSession, sessionMutation] = useBillingLinks(productName, annual)

    return (
        <div className={classNames("p-10 rounded-xl relative", {
            "scale-110 bg-primary-500": recommended,
            "bg-pg-50": !recommended,
        })}>
            {recommended &&
                <Text className="absolute bottom-full left-0 w-full text-center pb-2 uppercase text-primary-800 text-sm font-bold">Recommended</Text>}

            <Text className="text-xl font-bold my-2">
                Prototype
            </Text>
            <Text className="text-md">
                For small projects and personal use
            </Text>

            <Divider className="my-4" color={recommended ? "pg" : "pg.1"} />

            <Group className="items-end gap-1">
                <Text className="text-4xl text-pg font-bold">
                    $49
                </Text>
                <Text className="text-sm">
                    /month
                </Text>
            </Group>

            <Divider className="my-4" color={recommended ? "pg" : "pg.1"} />

            <Stack className="gap-xs">
                <FeatureLine>up to 100,000 connected accounts</FeatureLine>
                <FeatureLine>Integration Portal for your users</FeatureLine>
                <FeatureLine>API key integrations</FeatureLine>
            </Stack>

            <Center className="mt-6">
                {user ?
                    <Button
                        variant="white" color={recommended ? "primary" : "pg"}
                        onClick={createSession} loading={sessionMutation.isLoading}
                    >
                        Upgrade Now
                    </Button> :
                    <Button
                        variant="white" color={recommended ? "primary" : "pg"}
                        component={Link} href="/login?register&redirect=/dashboard/billing"
                    >
                        Sign Up
                    </Button>}
            </Center>
        </div>
    )
}

function FeatureLine({ children }) {
    return (
        <Group noWrap className="items-start">
            <ThemeIcon color="pg" className="rounded-full">
                <TbCheck />
            </ThemeIcon>
            <Text className="text-sm mt-0.5">{children}</Text>
        </Group>
    )
}