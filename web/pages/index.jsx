import { Button, Center, Divider, Stack, Text, Title } from "@mantine/core"
import BrandCarousel from "@web/components/BrandCarousel"
import { signOut, useMustBeSignedIn } from "@web/modules/firebase/auth"
import Link from "next/link"
import { TbBrandX, TbDashboard, TbExternalLink, TbLogout, TbMail } from "react-icons/tb"


export default function IndexPage() {

    useMustBeSignedIn()

    return (
        <div className="flex min-h-screen w-screen items-stretch flex-col-reverse md:flex-row">
            <Center className="p-xl max-w-sm grow mx-auto">
                <Stack>
                    <Title order={2} className="text-center">
                        Welcome to WoahAuth
                    </Title>
                    <Text className="text-center text-lg">
                        You've joined! 🎉
                    </Text>
                    <Text className="text-center text-gray">
                        Get hyped! Connecting to your users' accounts is about to get a whole lot easier.
                    </Text>

                    <Button
                        color="pg" leftIcon={<TbDashboard />}
                        component={Link} href="/dashboard"
                    >
                        Go to Dashboard
                    </Button>

                    <Divider />

                    <Text className="text-gray text-center">
                        Follow me on X for updates.
                    </Text>
                    <Button
                        color="dark" leftIcon={<TbBrandX />} rightIcon={<TbExternalLink />}
                        component="a" target="_blank" href="https://x.com/Zach_Sents"
                    >
                        @Zach_Sents
                    </Button>

                    <Text className="text-gray text-center mt-4">
                        Email me if you have any questions.
                    </Text>
                    <Button
                        color="pg" leftIcon={<TbMail />} variant="light"
                        component="a" target="_blank" href="mailto:info@woahauth.com"
                    >
                        info@woahauth.com
                    </Button>

                    <Divider className="mt-4" />

                    <Center>
                        <Button onClick={signOut} leftIcon={<TbLogout />}>
                            Sign Out
                        </Button>
                    </Center>
                </Stack>
            </Center>
            <div className="bg-pg-800 flex-1 min-w-0 flex flex-col items-stretch py-12">
                <BrandCarousel showComingSoon />
            </div>
        </div>
    )
}
