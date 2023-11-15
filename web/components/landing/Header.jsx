import { ActionIcon, Avatar, Button, Divider, Group, Menu, Stack } from "@mantine/core"
import { signOut } from "@web/modules/firebase/auth"
import classNames from "classnames"
import Link from "next/link"
import { TbLogout, TbMenu2 } from "react-icons/tb"
import { useUser } from "reactfire"
import Brand from "./Brand"


export default function Header() {

    const { data: user } = useUser()

    const navLinks = <>
        {user ? <>
            <NavigationLink href="/dashboard" className="md:hidden">
                Dashboard
            </NavigationLink>
            <Divider className="md:hidden" />
        </> : <>
            <NavigationLink href="/login?register" className="md:hidden">
                Sign Up
            </NavigationLink>
            <NavigationLink href="/login" className="md:hidden">
                Sign In
            </NavigationLink>
            <Divider className="md:hidden" />
        </>}

        <NavigationLink href="#how-it-works">
            How It Works
        </NavigationLink>
        <NavigationLink href="#integrations">
            Integrations
        </NavigationLink>
        <NavigationLink href="#pricing">
            Pricing
        </NavigationLink>

        {user && <>
            <Divider className="md:hidden" />
            <NavigationLink href="#" className="md:hidden" onClick={signOut}>
                Sign Out
            </NavigationLink>
        </>}
    </>

    return (
        <header className="sticky top-0 bg-pg-800 z-10">
            <div className="flex justify-between items-center p-xs max-w-7xl w-full mx-auto">
                <Group className="gap-10">
                    <Brand />

                    <Group className="hidden md:flex gap-xl [&_a]:text-white">
                        {navLinks}
                    </Group>
                </Group>

                <Group className="hidden md:flex gap-xl">
                    {user ? <>
                        <Menu position="bottom" shadow="lg">
                            <Menu.Target>
                                <Avatar src={user.photoURL} className="cursor-pointer rounded-full">
                                    {user.displayName?.[0] || user.email?.[0]}
                                </Avatar>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item icon={<TbLogout />} onClick={signOut}>
                                    Sign Out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        <Button
                            component={Link} href="/dashboard" variant="outline"
                        >
                            Go to Dashboard
                        </Button>
                    </> : <>
                        <NavigationLink href="/login" className="text-white">
                            Sign In
                        </NavigationLink>
                        <Button
                            component={Link} href="/login?register"
                        >
                            Sign Up
                        </Button>
                    </>}
                </Group>

                <Menu position="bottom-end" shadow="lg" classNames={{
                    dropdown: "p-xl",
                }}>
                    <Menu.Target>
                        <ActionIcon
                            size="xl" variant="outline" color=""
                            className="md:hidden text-xl"
                        >
                            <TbMenu2 />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Stack className="[&_a]:text-dark">
                            {navLinks}
                        </Stack>
                    </Menu.Dropdown>
                </Menu>
            </div>
        </header>
    )
}


function NavigationLink({ children, className, ...props }) {
    return (
        <Link {...props} className={classNames("no-underline hover:text-primary text-sm font-medium", className)}>
            {children}
        </Link>
    )
}