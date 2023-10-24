import { Button, Card, Center, Group, Progress, Stack, Switch, Text, ThemeIcon, Title } from "@mantine/core"
import DashboardShell from "@web/components/DashboardShell"
import { useCreateCheckoutSession, useGoToCustomerPortal, useProductInfo, useUserClaims } from "@web/modules/stripe"
import { useFunctionQuery } from "@zachsents/fire-query"
import Head from "next/head"
import { useState } from "react"
import { TbArrowUpRight, TbPigMoney, TbStar } from "react-icons/tb"
import { FREE_ACCOUNT_LIMIT } from "shared/stripe"


export default function DashboardBillingPage() {

    const [annual, setAnnual] = useState(true)

    const [goToPortal, portalMutation] = useGoToCustomerPortal()

    const userClaims = useUserClaims()
    const stripeRole = userClaims.data?.stripeRole
    const isStarter = stripeRole === "starter"
    const isBusiness = stripeRole === "business"

    const productInfoQuery = useProductInfo(stripeRole)
    const countQuery = useFunctionQuery("GetAccountsUsage", {}, {
        refetchInterval: 1000 * 30 // 30 seconds
    })

    const accountsUsed = countQuery.data?.data ?? 0
    const accountsTotal = productInfoQuery.data?.metadata.accountLimit ?
        parseInt(productInfoQuery.data?.metadata.accountLimit) : FREE_ACCOUNT_LIMIT

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
                    <Card className="p-xl bg-pg-600">
                        <Text className="text-xs uppercase font-bold text-pg-100">
                            Current Plan
                        </Text>
                        <Text className="text-3xl text-white font-bold mt-md">
                            {productInfoQuery.data?.name ?? "Free"}
                        </Text>
                    </Card>
                </Group>

                <Stack>
                    {!isStarter && !isBusiness &&
                        <BillingCard
                            productName="starter"
                            {...{ annual, setAnnual }}
                        />}
                    {!isBusiness &&
                        <BillingCard
                            productName="business" color="primary"
                            {...{ annual, setAnnual }}
                        />}
                </Stack>

                <Center>
                    <Button
                        color="gray" leftIcon={<TbPigMoney />}
                        onClick={goToPortal} loading={portalMutation.isLoading}
                    >
                        Manage Billing
                    </Button>
                </Center>
            </Stack>
        </DashboardShell>
    </>)
}


function BillingCard({ productName, color = "pg", annual, setAnnual }) {

    const productInfoQuery = useProductInfo(productName)
    const accountLimitLabel = parseInt(productInfoQuery.data?.metadata.accountLimit).toLocaleString()

    const [createCheckoutSession, checkoutSessionMutation] = useCreateCheckoutSession(productName, annual)

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
                            classNames={{ track: "cursor-pointer" }}
                        />
                    </Stack>
                    <Button
                        rightIcon={<TbArrowUpRight />} color={color}
                        onClick={createCheckoutSession} loading={checkoutSessionMutation.isLoading}
                    >
                        Upgrade Now
                    </Button>
                </Group>
            </Group>
        </Card>
    )
}