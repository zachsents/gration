import { Avatar, Badge, Button, Center, Group, Loader, Stack, Text } from "@mantine/core"
import { useFunctionQuery } from "@zachsents/fire-query"
import { useState } from "react"
import { TbArrowLeft, TbArrowRight, TbBrandGoogle } from "react-icons/tb"
import { useQuery } from "react-query"
import CTAButton from "./CTAButton"


export default function HeroSection() {


    return (
        <div className="relative">
            <div className="bg-pg-800 absolute top-0 -bottom-10 md:bottom-64 w-full z-[-1]" />
            <div className="w-full max-w-5xl mx-auto flex flex-col text-white items-stretch px-md pt-20" >
                <Group className="mb-24 md:gap-20 items-start justify-center">
                    <div className="flex-1">
                        <Text className="text-center md:text-left text-pg-200 text-lg font-bold -mb-6">
                            Hey SaaS developer!
                        </Text>

                        <h1 className="text-center md:text-left text-5xl md:text-6xl font-bold">
                            Add third-party integrations to your SaaS
                        </h1>
                        <Text className="text-center md:text-left text-xl max-w-3xl">
                            Building valuable SaaS tools means integrating with your users' data.
                        </Text>
                        <Text className="text-center md:text-left text-xl max-w-3xl">
                            WoahAuth saves you from building complex authentication flows.
                        </Text>

                        <div className="flex justify-center md:block">
                            <CTAButton />
                        </div>
                    </div>

                    <LiveDemo />
                </Group>

                <h3 id="how-it-works" className="text-2xl text-center scroll-m-20">
                    What developers see
                </h3>

                <div className="hidden md:block w-full rounded-xl p-xl bg-pg-300">
                    <img src="/graphics/demo-diagram.png" className="w-full" />
                </div>

                <div className="md:hidden w-full h-[24rem] px-xs">
                    <div className="w-full h-full rounded-xl p-xl bg-pg-300 overflow-scroll">
                        <img src="/graphics/demo-diagram.png" className="w-[200vw]" />
                    </div>
                </div>
            </div>
        </div>
    )
}


function LiveDemo() {

    const [demoUserId, setDemoUserId] = useState()

    const popupDemoLogin = () => {
        const newUserId = Math.random().toString(32).substring(2) + Math.random().toString(32).substring(2)
        setDemoUserId(newUserId)

        const newwindow = window.open(
            `https://woahauth.com/oauth/authorize/aRgMiBgrS2LyeUUn44p6?user=${newUserId}`,
            "WoahAuth Demo",
            "height=550,width=450"
        )

        if (window.focus)
            newwindow.focus()
    }

    const tokenQuery = useFunctionQuery("GetDemoToken", {
        userId: demoUserId,
    }, {
        enabled: !!demoUserId,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    })

    const userInfoQuery = useQuery({
        queryKey: [tokenQuery.data?.data?.accessToken],
        queryFn: () => fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${tokenQuery.data?.data?.accessToken}`
            }
        }).then(res => res.json()),
        enabled: !!tokenQuery.data?.data?.accessToken,
    })

    return (
        <Stack className="bg-white rounded-xl md:mt-16 py-xl px-4 md:px-12 text-dark items-center">
            <Badge color="pg" className="-mb-2">Demo</Badge>
            <Text className="text-xl font-bold text-center">Try it out!</Text>

            <div className="p-8 relative">
                <Button
                    color="blue" size="lg"
                    className="rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:scale-110 transition"
                    leftIcon={<TbBrandGoogle />}
                    onClick={popupDemoLogin}
                >
                    Connect Google
                </Button>
                <TbArrowLeft className="text-2xl absolute top-0 right-0 -rotate-45" />
                <TbArrowLeft className="text-2xl absolute bottom-0 right-0 rotate-45" />
                <TbArrowRight className="text-2xl absolute top-0 left-0 rotate-45" />
                <TbArrowRight className="text-2xl absolute bottom-0 left-0 -rotate-45" />
            </div>

            {(userInfoQuery.isLoading || tokenQuery.isLoading) &&
                <Center>
                    <Loader variant="bars" />
                </Center>}

            {userInfoQuery.data && <>
                <Group>
                    <Avatar src={userInfoQuery.data?.picture} radius="xl">
                        {userInfoQuery.data?.name?.[0] || userInfoQuery.data?.email?.[0] || "?"}
                    </Avatar>
                    <Text className="font-bold">{userInfoQuery.data?.name}</Text>
                </Group>

                <pre className="text-xs w-0 min-w-full overflow-scroll bg-gray-100 rounded-md p-2">
                    {JSON.stringify(userInfoQuery.data, null, 4)}
                </pre>
            </>}
        </Stack>
    )
}
