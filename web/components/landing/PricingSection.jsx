import { Button, Center, Divider, Group, Stack, Switch, Text, ThemeIcon } from "@mantine/core"
import { useBillingLinks } from "@web/modules/stripe"
import classNames from "classnames"
import Link from "next/link"
import { useState } from "react"
import { TbCheck } from "react-icons/tb"
import { useUser } from "reactfire"
import { FREE_ACCOUNT_LIMIT } from "shared/stripe"
import Section, { SectionHeader } from "./Section"


export default function PricingSection() {

    const [annual, setAnnual] = useState(false)



    return (
        <Section id="pricing">
            <SectionHeader>
                <Text className="uppercase text-primary-800 -mb-6">Pricing</Text>
                <h4 className="text-3xl font-bold">
                    Integrations affordable for everyone
                </h4>
                <Text className="text-xl">
                    WoahAuth is free for the first {FREE_ACCOUNT_LIMIT} connected accounts, then we offer affordable pricing plans for growing SaaS companies.
                </Text>
            </SectionHeader>

            <div className="grid grid-cols-3 gap-10">
                <PriceCard
                    productName="starter"
                    annual={annual}
                    annualPrice={199} monthlyPrice={19}
                    description="For small projects and personal use"
                    features={[
                        "Unlimited integration clients",
                        "Up to 1,000 connected accounts",
                        "API key integrations",
                    ]}
                />
                <PriceCard
                    productName="business"
                    annual={annual}
                    annualPrice={949} monthlyPrice={89}
                    description="For growing SaaS companies"
                    features={[
                        "Unlimited integration clients",
                        "Up to 50,000 connected accounts",
                        "API key integrations",
                        "Integration Portal for your users",
                    ]}
                    recommended
                />
                <PriceCard
                    productName="enterprise"
                    annual={annual}
                    annualPrice={2199} monthlyPrice={199}
                    description="For established SaaS companies with large userbases"
                    features={[
                        "Unlimited integration clients",
                        "Up to 1,000,000 connected accounts",
                        "Integration Portal for your users",
                        "API key integrations",
                        "Direct support line",
                    ]}
                    cta={<Button
                        variant="white" color="pg"
                        component="a" href="mailto:info@woahauth.com?subject=Enterprise+Inquiry"
                    >
                        Contact Us
                    </Button>}
                />
            </div>

            <Center className="mt-12 flex-col gap-2">
                <Text className="text-md">
                    Billed <span className={!annual && "font-bold"}>monthly</span> / <span className={annual && "font-bold"}>annually</span>
                </Text>
                <Switch
                    checked={annual} onChange={event => setAnnual(event.currentTarget.checked)}
                    classNames={{ track: "cursor-pointer" }}
                    size="lg"
                />
            </Center>
        </Section>
    )
}

function PriceCard({ productName, description, annual = false, annualPrice, monthlyPrice, features = [], recommended = false, cta }) {

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
                {productName[0].toUpperCase() + productName.slice(1)}
            </Text>
            <Text className="text-md">
                {description}
            </Text>

            <Divider className="my-4" color={recommended ? "pg" : "pg.1"} />

            <Group className="items-end gap-1">
                <Text className="text-4xl text-pg font-bold">
                    ${annual ? annualPrice : monthlyPrice}
                </Text>
                <Text className="text-sm">
                    /{annual ? "year" : "month"}
                </Text>
            </Group>

            <Divider className="my-4" color={recommended ? "pg" : "pg.1"} />

            <Stack className="gap-xs">
                {features.map((feature, i) => (
                    <FeatureLine key={i}>{feature}</FeatureLine>
                ))}
            </Stack>

            <Center className="mt-6">
                {cta || (user ?
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
                    </Button>)}
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