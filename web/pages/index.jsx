import { Button, Center, Divider, Stack, Text, Title } from "@mantine/core"
import BrandCarousel from "@web/components/BrandCarousel"
import { signOut, useMustBeSignedIn } from "@web/modules/firebase/auth"
import { TbBrandX, TbExternalLink, TbLogout } from "react-icons/tb"


export default function IndexPage() {

    useMustBeSignedIn()

    return (
        <div className="flex h-screen max-h-screen w-screen items-stretch flex-col-reverse md:flex-row">
            <Center className="p-xl max-w-sm grow mx-auto">
                <Stack>
                    <Title order={2} className="text-center">
                        Welcome to WoahAuth
                    </Title>
                    <Text className="text-center text-lg">
                        You're on the waitlist!
                    </Text>
                    <Text className="text-center text-gray">
                        Get hyped! Connecting to your users' accounts is about to get a whole lot easier.
                    </Text>

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

                    <Divider className="mt-20" />

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
