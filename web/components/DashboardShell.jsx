import { ActionIcon, Divider, Group, Menu, NavLink, Stack, Text, TextInput } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { signOut, useMustBeSignedIn } from "@web/modules/firebase/auth"
import { useSearch } from "@web/modules/search"
import { Services, useServiceClientAccountCount, useServiceClients } from "@web/modules/service-clients"
import Link from "next/link"
import { useRouter } from "next/router"
import { useRef } from "react"
import { TbChevronDown, TbExternalLink, TbLogout, TbMoneybag, TbPlus, TbSearch, TbUser, TbX } from "react-icons/tb"


export default function DashboardShell({ children }) {

    const user = useMustBeSignedIn()
    const { data: serviceClients } = useServiceClients()

    const [filteredServiceClients, searchQuery, setSearchQuery] = useSearch(serviceClients, {
        selector: client => `${client.nickname || ""} ${client.serviceId}`,
    })

    return (
        <div className="w-screen min-h-screen flex gap-md items-stretch p-md relative">
            <Stack className="w-56 sticky top-md h-full">
                <Text
                    component={Link} href="/"
                    className="text-xl font-bold px-1 py-md -my-md hover:text-orange-800 hover:scale-105 hover:translate-x-1 hover:-translate-y-1 hover:-rotate-2 transition"
                >
                    😲 WoahAuth
                </Text>

                <Stack className="gap-0">
                    <NavLink
                        label="Billing" icon={<TbMoneybag />} rightSection={<TbExternalLink className="text-gray" />}
                        component={Link} href="#billing"
                        className="rounded-md"
                    />
                    <Menu position="bottom" shadow="lg" offset={0}>
                        <Menu.Target>
                            <NavLink
                                label={<div>
                                    <Text>My Account</Text>
                                    <Text className="text-xs text-gray">{user?.email || "..."}</Text>
                                </div>}
                                icon={<TbUser />} rightSection={<TbChevronDown className="text-gray" />}
                                className="rounded-md"
                            />
                        </Menu.Target>
                        <Menu.Dropdown miw="10rem">
                            <Menu.Item icon={<TbLogout />} onClick={signOut}>
                                Sign Out
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Stack>

                <Divider label="Service Clients" />

                <NavLink
                    label="New Client" icon={<TbPlus />}
                    active
                    className="rounded-md font-bold mb-2 -mt-2"
                    onClick={() => modals.openContextModal({
                        modal: "CreateClient",
                        title: "New Service Client",
                        centered: true,
                        size: "lg",
                    })}
                />

                <SearchInput value={searchQuery} onChange={setSearchQuery} />

                <Stack className="gap-1">
                    {filteredServiceClients?.map(client =>
                        <ServiceClientLink {...client} key={client.id} />
                    )}
                </Stack>
            </Stack>

            <div className="flex-1 min-w-0 bg-gray-50 rounded-lg">
                {children}
            </div>
        </div>
    )
}


function ServiceClientLink({ nickname, serviceId, id }) {

    const router = useRouter()
    const isActive = router.query.serviceClientId === id

    const serviceType = Services.find(service => service.id === serviceId)

    const userCount = useServiceClientAccountCount(id)

    return (
        <NavLink
            icon={<serviceType.icon />}
            label={<div>
                {nickname ?
                    <Text>{nickname}</Text> :
                    <Text className="text-gray">Untitled Client</Text>}
                <Group className="gap-1 text-xs text-gray">
                    <Text>
                        {serviceType.name}
                    </Text>
                    {userCount.isSuccess ? <>
                        <Text>&#x2022;</Text>
                        <Text>{userCount.data} accounts</Text>
                    </> : null}
                </Group>
            </div>}
            active={isActive} color="pg"
            className="rounded-md"
            component={Link} href={`/dashboard/${id}`}
        />
    )
}


function SearchInput({ onChange, ...props }) {

    const { ref: containerRef, hovered } = useHover()
    const inputRef = useRef()

    const clear = () => {
        onChange?.("")
        inputRef.current?.focus()
    }

    return (
        <div ref={containerRef}>
            <TextInput
                variant="filled" radius="xl"
                placeholder="Search clients" icon={<TbSearch />}
                rightSection={hovered && <ActionIcon onClick={clear} radius="xl">
                    <TbX />
                </ActionIcon>}
                onChange={ev => onChange?.(ev.currentTarget.value)}
                {...props}
                ref={inputRef}
            />
        </div>
    )
}