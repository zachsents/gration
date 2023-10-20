import { Button, Select, Stack } from "@mantine/core"
import { useForm } from "@mantine/form"
import OAuthClientIdInput from "./OAuthClientIDInput"
import OAuthClientSecretInput from "./OAuthClientSecretInput"
import OAuthClientScopesInput from "./OAuthClientScopesInput"
import { Services } from "@web/modules/service-clients"
import { useFunctionMutation } from "@zachsents/fire-query"
import { useRouter } from "next/router"


export default function CreateClientModal({ context, id }) {

    const router = useRouter()

    const form = useForm({
        initialValues: {
            serviceId: "",
            clientId: "",
            clientSecret: "",
            scopes: [],
        },
        validate: {
            serviceId: value => !value,
            clientId: value => !value,
            clientSecret: value => !value,
        },
    })

    const serviceType = Services.find(service => service.id === form.values.serviceId)

    const registerClientMutation = useFunctionMutation("RegisterOAuth2Client")
    const createClient = async values => {
        const { data: { serviceClientId } } = await registerClientMutation.mutateAsync(values)
        router.push(`/dashboard/${serviceClientId}`)
        context.closeModal(id)
    }

    return (
        <form onSubmit={form.onSubmit(createClient)}>
            <Stack>
                <Select
                    label="Service"
                    data={serviceSelectData}
                    placeholder="Select a service" withinPortal
                    {...form.getInputProps("serviceId")}
                    classNames={{ label: "font-normal" }}
                />

                {form.values.serviceId &&
                    <>
                        <OAuthClientIdInput
                            sourceName={serviceType?.dashboardName || serviceType?.name}
                            {...form.getInputProps("clientId")}
                            placeholder="Client ID"
                        />
                        <OAuthClientSecretInput
                            sourceName={serviceType?.dashboardName || serviceType?.name}
                            {...form.getInputProps("clientSecret")}
                            placeholder="Client Secret"
                        />
                        <OAuthClientScopesInput
                            scopesListUrl={serviceType?.scopesListUrl} scopesList={serviceType?.scopesList ?? []}
                            {...form.getInputProps("scopes")}
                        />
                    </>}

                <Button type="submit" disabled={!form.isValid()} loading={registerClientMutation.isLoading}>
                    Create Client
                </Button>
            </Stack>
        </form>
    )
}

const serviceSelectData = Services.filter(service => service.canCreateClient && service.built).map(service => ({
    value: service.id,
    label: service.name,
}))