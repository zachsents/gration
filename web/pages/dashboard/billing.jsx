import { Button, Card, Center, Group, Progress, Stack, Switch, Text, ThemeIcon, Title } from "@mantine/core"
import DashboardShell from "@web/components/DashboardShell"
import { useMustBeSignedIn } from "@web/modules/firebase/auth"
import { useProductInfo } from "@web/modules/stripe"
import { useFunctionQuery } from "@zachsents/fire-query"
import Head from "next/head"
import { useState } from "react"
import { TbArrowUpRight, TbExternalLink, TbStar } from "react-icons/tb"


export default function DashboardBillingPage() {

    const user = useMustBeSignedIn()

    const stripeLink = user?.email ?
        `${process.env.NEXT_PUBLIC_STRIPE_BILLING_PORTAL_LINK}?prefilled_email=${user?.email}` :
        process.env.NEXT_PUBLIC_STRIPE_BILLING_PORTAL_LINK

    const countQuery = useFunctionQuery("GetAccountsUsage", {})
    const productInfoQuery = useProductInfo("starter")

    const accountsUsed = countQuery.data?.data ?? 0
    const accountsTotal = productInfoQuery.data?.metadata.accountLimit ?
        parseInt(productInfoQuery.data?.metadata.accountLimit) : 0

    // const userClaims = useUserClaims()
    // console.log(user, userClaims.data)

    return (<>
        <Head>
            <title>Usage & Billing | WoahAuth</title>
        </Head>
        <DashboardShell>
            <Stack className="p-xl gap-12">
                <Title order={2}>Usage & Billing</Title>

                <Group grow noWrap className="items-stretch">
                    <Card className="base-border p-xl">
                        <Text className="text-xs uppercase font-bold">
                            Connected User Accounts
                        </Text>
                        <Text className="text-lg font-bold">
                            {accountsUsed.toLocaleString()} / {accountsTotal.toLocaleString()}
                        </Text>
                        <Progress
                            value={accountsTotal > 0 ? (100 * accountsUsed / accountsTotal) : 0}
                            size="lg" className="rounded-full mt-sm"
                        />
                    </Card>
                    <Card className="p-xl bg-pg-100">
                        <Text className="text-xs uppercase font-bold text-pg">
                            Current Plan
                        </Text>
                        <Text className="text-3xl text-pg font-bold mt-md">
                            Starter
                        </Text>
                    </Card>
                </Group>

                <Stack>
                    <BillingCard
                        productName="starter"
                        monthlyBillingLink="https://buy.stripe.com/aEU6s82iv3HD7vieUW"
                        annualBillingLink="https://buy.stripe.com/00g2bS7CPfql2aY5kn"
                    />
                    <BillingCard
                        productName="business" color="primary"
                        monthlyBillingLink="https://buy.stripe.com/3cs9Ek5uH0vr02Q9AE"
                        annualBillingLink="https://buy.stripe.com/14k4k03mz2DzbLy28d"
                    />
                </Stack>

                <Center>
                    <Button
                        component="a" href={stripeLink} target="_blank"
                        rightIcon={<TbExternalLink />} color="gray"
                    >
                        Manage Billing
                    </Button>
                </Center>
            </Stack>
        </DashboardShell>
    </>)
}


function BillingCard({ productName, color = "pg", monthlyBillingLink, annualBillingLink }) {

    const productInfoQuery = useProductInfo(productName)
    const accountLimitLabel = parseInt(productInfoQuery.data?.metadata.accountLimit).toLocaleString()

    const [annual, setAnnual] = useState(true)

    return (
        <Card className="base-border p-xl">
            <Group position="apart">
                <Stack className="gap-xs">
                    <Group>
                        <ThemeIcon color={color} size="xl" className="text-xl">
                            <TbStar />
                        </ThemeIcon>
                        <Text className="text-3xl font-bold">
                            {productInfoQuery.data?.name}
                        </Text>
                    </Group>
                    <Text>
                        up to <Text span color={color} className="font-bold">{accountLimitLabel}</Text> connected user accounts
                    </Text>
                </Stack>
                <Group className="gap-xl">
                    <Stack className="gap-0 items-end">
                        <Text className="text-xs text-gray">Billing Frequency</Text>
                        <Text className="text-xs"><Text span fw={annual ? 400 : 600}>Monthly</Text> / <Text span fw={annual ? 600 : 400}>Annual</Text></Text>
                        <Switch
                            className="mt-2" color={color}
                            checked={annual} onChange={evt => setAnnual(evt.currentTarget.checked)}
                        />
                    </Stack>
                    <Button
                        leftIcon={<TbArrowUpRight />} rightIcon={<TbExternalLink />} color={color}
                        component="a" href={annual ? annualBillingLink : monthlyBillingLink} target="_blank"
                    >
                        Upgrade Now
                    </Button>
                </Group>
            </Group>
        </Card>
    )
}