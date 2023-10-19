import { Accordion, ActionIcon, Anchor, Button, Center, CopyButton, Group, Loader, Menu, Stack, Table, Text, TextInput, Textarea, Timeline, Title, Tooltip } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useLocalStorage } from "@mantine/hooks"
import DashboardShell from "@web/components/DashboardShell"
import EditableText from "@web/components/EditableText"
import HiddenOverlay from "@web/components/HiddenOverlay"
import ScopesInput from "@web/components/ScopesInput"
import { Services, useCurrentServiceClient, useServiceClientAccounts } from "@web/modules/service-clients"
import { useDocumentMutators, useFunctionMutation } from "@zachsents/fire-query"
import classNames from "classnames"
import { arrayRemove } from "firebase/firestore"
import Head from "next/head"
import { TbCheck, TbCode, TbCopy, TbDots, TbKey, TbLink, TbRefresh, TbSettings, TbTrash, TbUserCancel } from "react-icons/tb"
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
                <Inner /> :
                <Center className="w-full h-full">
                    <Loader variant="bars" />
                </Center>}
        </DashboardShell>
    </>)
}

function Inner() {

    const { data: serviceClient, update } = useCurrentServiceClient()
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

    const redirectUrl = `https://woahauth.com/oauth/callback/${serviceClient.id}`
    const authorizeUrl = <>https://woahauth.com/oauth/authorize/{serviceClient.id}?user=<span className="text-gray">[YOUR_USERS_ID]</span></>

    const rollSecretKeyMutation = useFunctionMutation("RollOAuth2SecretKey")
    const rollSecretKey = () => {
        rollSecretKeyMutation.mutate({ serviceClientId: serviceClient.id })
    }

    const connectedAccounts = useServiceClientAccounts(serviceClient.id)

    let timelineStep = 0
    if (connectedAccounts.data?.length > 0)
        timelineStep = 1

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
                        <Menu.Item icon={<TbTrash />} color="red">Delete Client</Menu.Item>
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
                <Accordion.Item value="gettingStarted">
                    <Accordion.Control>
                        Getting Started
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Timeline active={timelineStep}>
                            <Timeline.Item bullet={<TbSettings />} title="Add WoahAuth redirect URL to OAuth client">
                                <Stack align="flex-start" spacing="xs">
                                    <Text className="text-gray text-sm">
                                        In {serviceType.dashboardName || serviceType.name}, add the following redirect URL to your OAuth client:
                                    </Text>
                                    <CopyableMono>
                                        {redirectUrl}
                                    </CopyableMono>
                                </Stack>
                            </Timeline.Item>

                            <Timeline.Item bullet={<TbLink />} title="Authorize users with this link">
                                <Stack align="flex-start" spacing="xs">
                                    <Text className="text-gray text-sm">
                                        Link users to the following URL to authorize their {serviceType.name} account:
                                    </Text>
                                    <CopyableMono>
                                        {authorizeUrl}
                                    </CopyableMono>
                                </Stack>
                            </Timeline.Item>

                            <Timeline.Item bullet={<TbCode />} title="Request an access token with the WoahAuth API">
                                <Stack align="flex-start" spacing="xs">
                                    <Text className="text-gray text-sm">
                                        Use the following code to fetch an access token for a user and make a request with it:
                                    </Text>
                                    {/* <Code block className="">
                                        hey man
                                    </Code> */}
                                </Stack>
                            </Timeline.Item>
                        </Timeline>
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="secretKey">
                    <Accordion.Control>
                        Secret Key
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Stack>
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

                                <div>
                                    <Text className="text-sm">OAuth Client ID</Text>
                                    <Text className="text-xs text-gray mb-1">
                                        Paste in your OAuth client ID from {serviceType.dashboardName || serviceType.name}
                                    </Text>
                                    <TextInput
                                        {...form.getInputProps("clientId")}
                                    />
                                </div>
                                <div>
                                    <Text className="text-sm">OAuth Client Secret</Text>
                                    <Text className="text-xs text-gray mb-1">
                                        Paste in your OAuth client secret from {serviceType.dashboardName || serviceType.name}
                                    </Text>
                                    <HiddenOverlay className="rounded-md base-border">
                                        <Textarea
                                            {...form.getInputProps("clientSecret")}
                                            autosize minRows={3} maxRows={6}
                                        />
                                    </HiddenOverlay>
                                </div>
                                <div>
                                    <Text className="text-sm">Requested Scopes</Text>
                                    <Text className="text-xs text-gray mb-1">
                                        You can find a <Anchor href={serviceType.scopesListUrl} target="_blank">full list of scopes here.</Anchor>
                                    </Text>
                                    <ScopesInput
                                        data={serviceType.scopesList}
                                        {...form.getInputProps("scopes")}
                                    />
                                </div>
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


function CopyableMono({ children, className, breakAnywhere = false, lineClamp }) {
    return (
        <CopyButton value={children}>
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
            const res = await fetch(`http://127.0.0.1:5001/gration-f5cd8/us-central1/api/serviceClient/aRgMiBgrS2LyeUUn44p6/getTokenForAccount/${account.id}`, {
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
            <td>{account.appUsers.map(userId =>
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