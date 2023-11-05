import { Anchor, Badge, Center, Group, Stack, Text, TextInput, ThemeIcon, Tooltip } from "@mantine/core"
import Section from "@web/components/landing/Section"
import { useSearch } from "@web/modules/search"
import { Services } from "@web/modules/service-clients"
import { TbCheck, TbClock } from "react-icons/tb"


const ShownServices = Services.filter(service => !service.hidden)


export default function IntegrationsSection({ ...props }) {

    const [filteredServices, query, setQuery] = useSearch(ShownServices, {
        selector: service => service.name,
    })

    return (
        <Section id="integrations" {...props}>
            <div className="-mx-md md:mx-0 md:rounded-xl bg-pg-800 text-white px-md md:pl-20 md:pr-0 py-12 bg-right md:bg-no-repeat" style={{
                backgroundImage: "url(/graphics/shapes.svg)",
                backgroundSize: "40%"
            }}>
                <Group noWrap className="w-full gap-10">
                    <Stack className="gap-xl md:max-w-[50%]">
                        <h4 className="text-3xl font-bold my-0">
                            Enjoy a growing ecosystem of <span className="text-primary-600">integrations</span>
                        </h4>
                        <Text className="text-xl">
                            We're always adding new integrations to give your SaaS more power 💪
                        </Text>

                        <TextInput
                            variant="filled" size="xl" radius="lg"
                            placeholder="Search for integrations..."
                            classNames={{
                                input: "focus:border-none",
                                root: "mb-4 hidden md:block",
                            }}
                            value={query}
                            onChange={event => setQuery(event.currentTarget.value)}
                        />

                        <Text className="text-sm">
                            Want something specific? <Anchor href="mailto:info@woahauth.com?subject=Integration+Request">Request an integration</Anchor>.
                        </Text>
                    </Stack>

                    <div className="hidden md:block flex-1 min-w-0">
                        {!query &&
                            <div className="grid grid-cols-3 gap-4 px-20">
                                {Array(3).fill().map((_, i) =>
                                    <div
                                        className="aspect-square bg-pg-400 rounded-lg"
                                        key={i}
                                    />
                                )}
                            </div>}

                        {!!query && filteredServices.length > 0 &&
                            <Group noWrap className="gap-xl justify-center">
                                {filteredServices.slice(0, 3).map(service =>
                                    <IntegrationStatus
                                        {...service}
                                        ready={service.built}
                                        key={service.id}
                                    />
                                )}
                            </Group>}

                        {!!query && filteredServices.length == 0 &&
                            <Center>
                                <Text className="text-center max-w-[12rem]">
                                    No integrations found. Try searching something else.
                                </Text>
                            </Center>}
                    </div>
                </Group>
            </div>
        </Section>
    )
}


function IntegrationStatus({ icon: Icon, name, color, ready = false }) {

    const badgeClass = "absolute top-full left-1/2 -translate-x-1/2"

    return (
        <div className="relative group py-2">
            <Tooltip label={name} color="pg.5" opened offset={8}>
                <ThemeIcon color={color} className="w-20 h-auto rounded-lg aspect-square text-3xl">
                    <Icon />
                </ThemeIcon>
            </Tooltip>
            {ready ?
                <Badge
                    className={badgeClass}
                    color="green" variant="filled"
                    leftSection={<Center><TbCheck /></Center>}
                >
                    Ready
                </Badge> :
                <Badge
                    className={badgeClass}
                    color="gray" variant="filled"
                    leftSection={<Center><TbClock /></Center>}
                >
                    WIP
                </Badge>}
        </div>
    )
}



