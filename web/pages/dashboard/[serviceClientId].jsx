import { Accordion, ActionIcon, Button, Center, CopyButton, Group, Loader, Menu, Stack, Table, Text, Timeline, Title, Tooltip } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useLocalStorage } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { Prism } from "@mantine/prism"
import DashboardShell from "@web/components/DashboardShell"
import EditableText from "@web/components/EditableText"
import OAuthClientIdInput from "@web/components/OAuthClientIDInput"
import OAuthClientScopesInput from "@web/components/OAuthClientScopesInput"
import OAuthClientSecretInput from "@web/components/OAuthClientSecretInput"
import { Services, useCurrentServiceClient, useServiceClientAccounts } from "@web/modules/service-clients"
import { useDocumentMutators, useFunctionMutation } from "@zachsents/fire-query"
import classNames from "classnames"
import { arrayRemove } from "firebase/firestore"
import Head from "next/head"
import { useRouter } from "next/router"
import { TbCheck, TbCode, TbCopy, TbDots, TbKey, TbLink, TbRefresh, TbSettings, TbTrash, TbUserCancel, TbUsers } from "react-icons/tb"
import { useMutation } from "react-query"
import { CONNECTED_ACCOUNTS_SUBCOLLECTION, SERVICE_CLIENTS_COLLECTION } from "shared/firestore"


export default function DashboardPage() {

    const { data: serviceClient, isLoading } = useCurrentServiceClient()

    return (<>
        <Head>
            <title>{serviceClient?.nickname || "Loading..."} | WoahAuth</title>
        </Head>
        <DashboardShell>
            {!isLoading && serviceClient ?
                <Inner key={serviceClient.id} /> :
                <Center className="w-full h-full">
                    <Loader variant="bars" />
                </Center>}
        </DashboardShell>
    </>)
}

function Inner() {

    const router = useRouter()

    const { data: serviceClient, update, delete: deleteClient } = useCurrentServiceClient()
    const serviceType = Services.find(service => service.id === serviceClient.serviceId)

    const [accordionValue, setAccordionValue] = useLocalStorage({
        key: "serviceClientConfigDashboardAccordion",
        defaultValue: [
            "secretKey",
            "gettingStarted",
            "oauthClientConfig",
            "manageAccounts",
        ],
    })

    const form = useForm({
        initialValues: {
            clientId: serviceClient.clientId || "",
            clientSecret: serviceClient.clientSecret || "",
            scopes: serviceClient.scopes || [],
        },
        validate: {
            clientId: value => !value,
            clientSecret: value => !value,
        },
    })

    const handleSubmit = async values => {
        await update.mutateAsync(values)
        form.resetDirty()
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/oauth/callback`
    const authorizeUrlDisplay = <>{process.env.NEXT_PUBLIC_DOMAIN}/oauth/authorize/{serviceClient.id}?user=<span className="text-gray">[YOUR_USERS_ID]</span></>
    const authorizeUrlCopy = `${process.env.NEXT_PUBLIC_DOMAIN}/oauth/authorize/${serviceClient.id}?user=`

    const rollSecretKeyMutation = useFunctionMutation("RollOAuth2SecretKey")
    const rollSecretKey = () => {
        rollSecretKeyMutation.mutate({ serviceClientId: serviceClient.id })
    }

    const connectedAccounts = useServiceClientAccounts(serviceClient.id)

    return (
        <Stack className="p-xl gap-12">
            <Group position="apart" className="-mb-xl">
                <EditableText
                    value={serviceClient.nickname} onChange={nickname => update.mutate({ nickname })}
                    cancelOnClickOutside
                >
                    <Group>
                        <Title order={2}>
                            {serviceClient.nickname}
                        </Title>
                        {update.isLoading && <Loader size="xs" />}
                    </Group>
                </EditableText>
                <Menu position="bottom-end" shadow="lg">
                    <Menu.Target>
                        <ActionIcon size="xl" className="bg-gray-100 hover:bg-gray-200">
                            <TbDots />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown miw="12rem">
                        <Menu.Item
                            icon={<TbRefresh />}
                            onClick={rollSecretKey} disabled={rollSecretKeyMutation.isLoading}
                        >
                            Roll Secret Key
                        </Menu.Item>
                        <Menu.Item
                            icon={<TbTrash />} color="red"
                            onClick={() => modals.openConfirmModal({
                                title: "Delete Client",
                                children: "Are you sure you want to delete this client? This action cannot be undone.",
                                cancelProps: { variant: "subtle", color: "gray" },
                                confirmProps: { color: "red" },
                                labels: {
                                    confirm: "Delete",
                                    cancel: "Cancel",
                                },
                                centered: true,
                                onConfirm: () => {
                                    deleteClient.mutate()
                                    router.push("/dashboard")
                                },
                            })}
                        >
                            Delete Client
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>

            <Accordion multiple value={accordionValue} onChange={setAccordionValue} classNames={{
                label: "text-gray uppercase font-bold text-xs py-2",
                control: "p-0 border-solid border-0 border-t-1 border-gray-400",
                content: "p-0 pt-2 pb-12",
                item: "border-none",
                chevron: "text-gray",
            }}>
                <Accordion.Item value="secretKey">
                    <Accordion.Control>
                        Secret Key
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Stack>
                            <Text className="font-bold">⚠️ Do not expose your secret key on the frontend!</Text>
                            <CopyableMono breakAnywhere>
                                {serviceClient.secretKey}
                            </CopyableMono>
                            <Group spacing="xs">
                                <Tooltip label="WARNING: this will make the current secret key invalid.">
                                    <Button
                                        leftIcon={<TbRefresh />} compact color="pg"
                                        onClick={rollSecretKey} loading={rollSecretKeyMutation.isLoading}
                                    >
                                        Roll Secret Key
                                    </Button>
                                </Tooltip>
                            </Group>
                        </Stack>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="gettingStarted">
                    <Accordion.Control>
                        Getting Started
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Timeline active={-1}>
                            <Timeline.Item bullet={<TbSettings />} title="1. Add WoahAuth redirect URL to OAuth client">
                                <Stack align="flex-start" spacing="xs">
                                    <Text className="text-gray text-sm">
                                        In {serviceType.dashboardName || serviceType.name}, add the following redirect URL to your OAuth client:
                                    </Text>
                                    <CopyableMono>
                                        {redirectUrl}
                                    </CopyableMono>
                                </Stack>
                            </Timeline.Item>

                            <Timeline.Item bullet={<TbLink />} title="2. Authorize users with this link">
                                <Stack align="flex-start" spacing="xs">
                                    <Text className="text-gray text-sm">
                                        Link users to the following URL to authorize their {serviceType.name} account:
                                    </Text>
                                    <CopyableMono value={authorizeUrlCopy}>
                                        {authorizeUrlDisplay}
                                    </CopyableMono>
                                </Stack>
                            </Timeline.Item>

                            <Timeline.Item bullet={<TbUsers />} title="3. List a user's connected accounts using the WoahAuth API">
                                <Stack align="flex-start" spacing="xs">
                                    <Text className="text-gray text-sm">
                                        Use the following code to list a user's connected accounts:
                                    </Text>
                                    <Prism language="js" colorScheme="dark" className="self-stretch">{listUsersCodeSample(serviceClient.id)}</Prism>
                                </Stack>
                            </Timeline.Item>

                            <Timeline.Item bullet={<TbCode />} title="4. Get a fresh access token using the WoahAuth API">
                                <Stack align="flex-start" spacing="xs">
                                    <Text className="text-gray text-sm">
                                        Use the following code to get a fresh access token for a connected account:
                                    </Text>
                                    <Prism language="js" colorScheme="dark" className="self-stretch">{getTokenCodeSample(serviceClient.id)}</Prism>
                                </Stack>
                            </Timeline.Item>
                        </Timeline>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="oauthClientConfig">
                    <Accordion.Control>
                        OAuth Client Configuration
                    </Accordion.Control>
                    <Accordion.Panel>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack className="relative pt-md">
                                {form.isDirty() &&
                                    <Group className="gap-2 absolute top-0 right-0">
                                        <Button compact type="submit" color="pg">Save Changes</Button>
                                        <Button
                                            compact type="submit" variant="subtle" color="red"
                                            onClick={form.reset}>
                                            Discard
                                        </Button>
                                    </Group>}


                                <OAuthClientIdInput
                                    sourceName={serviceType.dashboardName || serviceType.name}
                                    {...form.getInputProps("clientId")}
                                />
                                <OAuthClientSecretInput
                                    sourceName={serviceType.dashboardName || serviceType.name} withOverlay
                                    {...form.getInputProps("clientSecret")}
                                />
                                <OAuthClientScopesInput
                                    scopesListUrl={serviceType.scopesListUrl} scopesList={serviceType.scopesList}
                                    {...form.getInputProps("scopes")}
                                />
                            </Stack>
                        </form>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="manageAccounts">
                    <Accordion.Control>
                        Manage Accounts
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Account ID</th>
                                    <th>Associated User IDs</th>
                                    <th className="w-1/4">Access Token</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {connectedAccounts.data?.map(account =>
                                    <AccountRow
                                        account={account} serviceClientId={serviceClient.id} serviceClientSecretKey={serviceClient.secretKey}
                                        key={account.id}
                                    />
                                )}
                            </tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Stack>
    )
}


function CopyableMono({ children, value, className, breakAnywhere = false, lineClamp }) {
    return (
        <CopyButton value={value ?? children}>
            {({ copied, copy }) => (
                <Tooltip label="Click to copy">
                    <Group
                        noWrap
                        className={classNames("bg-gray-200 rounded-md py-1 px-xs text-sm cursor-pointer hover:bg-gray-300", className)}
                        onClick={copy}
                    >
                        {copied ?
                            <TbCheck className="text-green" /> :
                            <TbCopy className="text-gray" />}
                        <Text className={classNames("flex-1 font-mono", {
                            "break-all": breakAnywhere,
                        })} lineClamp={lineClamp}>{children}</Text>
                    </Group>
                </Tooltip>
            )}
        </CopyButton>
    )
}


function AccountRow({ account, serviceClientId, serviceClientSecretKey }) {

    const { update, delete: _deleteAccount } = useDocumentMutators([SERVICE_CLIENTS_COLLECTION, serviceClientId, CONNECTED_ACCOUNTS_SUBCOLLECTION, account.id])

    const deleteAccount = () => {
        _deleteAccount.mutate()
    }

    const removeAllUsers = () => {
        update.mutate({ appUsers: [] })
    }

    const removeUser = userId => {
        update.mutate({ appUsers: arrayRemove(userId) })
    }

    const accessTokenMutation = useMutation({
        mutationFn: async () => {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${serviceClientSecretKey}`)
            const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/serviceClient/${serviceClientId}/getTokenForAccount/${account.id}`, {
                headers,
            })
            return res.json()
        },
    })

    return (
        <tr className={classNames({
            "bg-gray-200": _deleteAccount.isLoading || update.isLoading,
        })}>
            <td>{account.id}</td>
            <td>{account.appUsers?.map(userId =>
                <Menu position="bottom" shadow="xs" key={userId}>
                    <Menu.Target>
                        <Button
                            compact size="xs" variant="subtle"
                            className="font-normal rounded-full"
                        >
                            {userId}
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item icon={<TbUserCancel />} onClick={() => removeUser(userId)}>
                            Remove User
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            )}</td>
            <td>
                {accessTokenMutation.data ?
                    <CopyableMono breakAnywhere lineClamp={1}>
                        {accessTokenMutation.data.accessToken}
                    </CopyableMono> :
                    <Button
                        compact color="pg" variant="light" leftIcon={<TbKey />}
                        loading={accessTokenMutation.isLoading}
                        onClick={accessTokenMutation.mutate}
                    >
                        Access Token
                    </Button>}
            </td>
            <td className="w-[0.1%]">
                <Menu position="bottom-end" shadow="md">
                    <Menu.Target>
                        <ActionIcon>
                            <TbDots />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            icon={<TbUserCancel />} color="red"
                            onClick={removeAllUsers}
                        >
                            Remove All Users
                        </Menu.Item>
                        <Menu.Item
                            icon={<TbTrash />} color="red"
                            onClick={deleteAccount}
                        >
                            Delete Account
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </td>
        </tr>
    )
}



const listUsersCodeSample = (serviceClientId) =>
    `const yourUsersId = "YOUR_USERS_ID"
const url = "${process.env.NEXT_PUBLIC_DOMAIN}/api/serviceClient/${serviceClientId}/listAccountsForUser/" + yourUsersId

const connectedAccountIds = await fetch(url, {
    headers: {
        // Do not expose your secret key in the frontend!
        "Authorization": "Bearer " + process.env.WOAHAUTH_SERVICE_CLIENT_SECRET_KEY,
    }
}).then(res => res.json())

/*
    Result:
    ["mark@facebook.com", "mark2@facebook.com", "zuck@facebook.com"]
*/`


const getTokenCodeSample = (serviceClientId) =>
    `const connectedAccountId = "connected_account_id_from_the_last_step"
const url = "${process.env.NEXT_PUBLIC_DOMAIN}/api/serviceClient/${serviceClientId}/getTokenForAccount/" + connectedAccountId

const tokenInfo = await fetch(url, {
    headers: {
        // Do not expose your secret key in the frontend!
        "Authorization": "Bearer " + process.env.WOAHAUTH_SERVICE_CLIENT_SECRET_KEY,
    }
}).then(res => res.json())

/*
    Result:
    { accessToken: "ya29...", expiresAt: "${new Date(Date.now() + 60 * 60 * 1000).toISOString()}" }
*/`