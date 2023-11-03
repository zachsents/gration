import { Button, Card, Center, Divider, Group, LoadingOverlay, Progress, Stack, Switch, Text, ThemeIcon, Title } from "@mantine/core"
import DashboardShell from "@web/components/DashboardShell"
import { useCreateCheckoutSession, useGoToCustomerPortal, useProductInfo, useUserClaims } from "@web/modules/stripe"
import { useFunctionQuery } from "@zachsents/fire-query"
import Head from "next/head"
import { useState } from "react"
import { TbArrowUpRight, TbPigMoney, TbStar } from "react-icons/tb"
import { useUser } from "reactfire"
import { FREE_ACCOUNT_LIMIT, STRIPE_ROLE } from "shared/stripe"


export default function DashboardBillingPage() {

    const [annual, setAnnual] = useState(true)

    const [goToPortal, portalMutation] = useGoToCustomerPortal()

    const { data: user } = useUser()
    const userClaims = useUserClaims()
    const stripeRole = userClaims.data?.stripeRole
    const isStarter = stripeRole === STRIPE_ROLE.STARTER
    const isBusiness = stripeRole === STRIPE_ROLE.BUSINESS
    const isFree = !isStarter && !isBusiness

    const productInfoQuery = useProductInfo(stripeRole)
    const countQuery = useFunctionQuery("GetAccountsUsage", {}, {
        refetchInterval: 1000 * 30, // 30 seconds
        queryKey: ["GetAccountsUsage", user?.uid],
        enabled: !!user?.uid,
    })

    const accountsUsed = countQuery.data?.data ?? 0
    const accountsTotal = productInfoQuery.data?.metadata.accountLimit ?
        parseInt(productInfoQuery.data?.metadata.accountLimit) : FREE_ACCOUNT_LIMIT

    const isLoading = userClaims.isLoading || productInfoQuery.isLoading

    return (<>
        <Head>
            <title>Usage & Billing | WoahAuth</title>
        </Head>
        <DashboardShell>
            <Stack className="p-xl gap-12">
                <Title order={2}>Usage & Billing</Title>

                <Group grow noWrap className="items-stretch">
                    <Card className="base-border p-xl relative">
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
                        <LoadingOverlay
                            visible={isLoading}
                            overlayBlur={5}
                            loaderProps={{ variant: "bars", size: "sm" }}
                        />
                    </Card>
                    <Card className="p-xl bg-pg-600 relative">
                        <Text className="text-xs uppercase font-bold text-pg-100">
                            Current Plan
                        </Text>
                        <Text className="text-3xl text-white font-bold mt-md">
                            {productInfoQuery.data?.name ?? "Free"}
                        </Text>
                        <LoadingOverlay
                            visible={isLoading || countQuery.isLoading}
                            overlayBlur={5}
                            loaderProps={{ variant: "bars", size: "sm" }}
                        />
                    </Card>
                </Group>

                <Stack>
                    {!isStarter && !isBusiness &&
                        <BillingCard
                            productName={STRIPE_ROLE.STARTER}
                            monthlyPrice={19} annualPrice={199}
                            shouldGoToPortal={!isFree}
                            {...{ annual, setAnnual }}
                        />}
                    {!isBusiness &&
                        <BillingCard
                            productName={STRIPE_ROLE.BUSINESS} color="primary"
                            monthlyPrice={49} annualPrice={499}
                            shouldGoToPortal={!isFree}
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


function BillingCard({ productName, color = "pg", annual, setAnnual, annualPrice, monthlyPrice, shouldGoToPortal = false }) {

    const productInfoQuery = useProductInfo(productName)
    const accountLimitLabel = parseInt(productInfoQuery.data?.metadata.accountLimit).toLocaleString()

    const [createCheckoutSession, checkoutSessionMutation] = useCreateCheckoutSession(productName, annual)
    const [goToPortal, portalMutation] = useGoToCustomerPortal()

    return (
        <Card className="base-border p-xl">
            <Group position="apart">
                <Group>
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
                    <Divider orientation="vertical" />
                    <Group className="gap-1 items-end">
                        <Text className="text-4xl font-bold">${annual ? annualPrice : monthlyPrice}</Text>
                        <Text className="text-sm text-gray">/</Text>
                        <Text className="text-sm text-gray">{annual ? "year" : "month"}</Text>
                    </Group>
                </Group>
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
                        onClick={shouldGoToPortal ? goToPortal : createCheckoutSession}
                        loading={shouldGoToPortal ? portalMutation.isLoading : checkoutSessionMutation.isLoading}
                    >
                        {shouldGoToPortal ? "Manage Subscription" : "Upgrade Now"}
                    </Button>
                </Group>
            </Group>
        </Card>
    )
}