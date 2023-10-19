import { ActionIcon, Anchor, Button, Center, CopyButton, Divider, Group, Loader, Menu, Stack, Text, TextInput, Textarea, Timeline, Title, Tooltip } from "@mantine/core"
import { useForm } from "@mantine/form"
import DashboardShell from "@web/components/DashboardShell"
import EditableText from "@web/components/EditableText"
import HiddenOverlay from "@web/components/HiddenOverlay"
import ScopesInput from "@web/components/ScopesInput"
import { Services, useCurrentServiceClient } from "@web/modules/service-clients"
import { useFunctionMutation } from "@zachsents/fire-query"
import classNames from "classnames"
import { TbCheck, TbCopy, TbDots, TbLink, TbRefresh, TbTrash } from "react-icons/tb"


export default function DashboardPage() {

    const { data: serviceClient, isLoading } = useCurrentServiceClient()

    return (
        <DashboardShell>
            {!isLoading && serviceClient ?
                <Inner /> :
                <Center className="w-full h-full">
                    <Loader variant="bars" />
                </Center>}
        </DashboardShell>
    )
}

function Inner() {

    const { data: serviceClient, update } = useCurrentServiceClient()
    const serviceType = Services.find(service => service.id === serviceClient.serviceId)

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

            <Stack>
                <div>
                    <Divider />
                    <Text className="uppercase font-bold text-gray text-xs mt-1">
                        Secret Key
                    </Text>
                </div>

                <CopyableURL url={serviceClient.secretKey} className="flex-1" />
                <Group spacing="xs">
                    <Button
                        leftIcon={<TbRefresh />} compact color="pg"
                        onClick={rollSecretKey} loading={rollSecretKeyMutation.isLoading}
                    >
                        Roll Secret Key
                    </Button>
                </Group>
            </Stack>

            <Stack>
                <div>
                    <Divider />
                    <Text className="uppercase font-bold text-gray text-xs mt-1">
                        Getting Started
                    </Text>
                </div>

                <Timeline active={1}>
                    <Timeline.Item bullet={<TbLink />} title="Add WoahAuth redirect URL to OAuth client">
                        <Stack align="flex-start" spacing="xs">
                            <Text className="text-gray text-sm">
                                In {serviceType.dashboardName || serviceType.name}, add the following redirect URL to your OAuth client:
                            </Text>
                            <CopyableURL url={redirectUrl} />
                        </Stack>
                    </Timeline.Item>

                    <Timeline.Item bullet={<TbLink />} title="Authorize users with this link">
                        <Stack align="flex-start" spacing="xs">
                            <Text className="text-gray text-sm">
                                Link users to the following URL to authorize their {serviceType.name} account:
                            </Text>
                            <CopyableURL url={authorizeUrl} />
                        </Stack>
                    </Timeline.Item>
                </Timeline>
            </Stack>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <div>
                        <Divider
                            label={form.isDirty() && <Group className="gap-2">
                                <Button compact type="submit" color="pg">Save Changes</Button>
                                <Button
                                    compact type="submit" variant="subtle" color="red"
                                    onClick={form.reset}>
                                    Discard
                                </Button>
                            </Group>}
                            labelPosition="right"
                        />
                        <Text className="uppercase font-bold text-gray text-xs mt-1">
                            OAuth Client Configuration
                        </Text>
                    </div>

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
        </Stack>
    )
}


function CopyableURL({ url, className }) {
    return (
        <CopyButton value={url}>
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
                        <Text className="font-mono">{url}</Text>
                    </Group>
                </Tooltip>
            )}
        </CopyButton>
    )
}