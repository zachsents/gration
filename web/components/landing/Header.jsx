import { Avatar, Button, Group, Menu } from "@mantine/core"
import Link from "next/link"
import Brand from "./Brand"
import { useUser } from "reactfire"
import { TbLogout } from "react-icons/tb"
import { signOut } from "@web/modules/firebase/auth"


export default function Header() {

    const { data: user } = useUser()

    return (
        <header className="sticky top-0 bg-pg-800 z-10">
            <div className="flex justify-between items-center p-xs max-w-7xl w-full mx-auto">
                <Group className="gap-10">
                    <Brand />
                    <Group className="gap-xl">
                        <NavigationLink href="#how-it-works">
                            How It Works
                        </NavigationLink>
                        <NavigationLink href="#integrations">
                            Integrations
                        </NavigationLink>
                        <NavigationLink href="#pricing">
                            Pricing
                        </NavigationLink>
                    </Group>
                </Group>

                <Group className="gap-xl">
                    {user ? <>
                        <Menu position="bottom" shadow="lg">
                            <Menu.Target>
                                <Avatar src={user.photoURL} className="cursor-pointer rounded-full">
                                    {user.displayName[0] || user.email[0]}
                                </Avatar>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item icon={<TbLogout />} onClick={signOut}>
                                    Sign Out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        <Button
                            component={Link} href="/dashboard"
                        >
                            Go to Dashboard
                        </Button>
                    </> : <>
                        <NavigationLink href="/login">
                            Sign In
                        </NavigationLink>
                        <Button
                            component={Link} href="/login?register"
                        >
                            Sign Up
                        </Button>
                    </>}
                </Group>
            </div>
        </header>
    )
}


function NavigationLink({ children, ...props }) {
    return (
        <Link {...props} className="no-underline text-white hover:text-primary text-sm font-medium">
            {children}
        </Link>
    )
}