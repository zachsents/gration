import { Avatar, Badge, Button, Card, Center, Group, Loader, Stack, Text } from "@mantine/core"
import { useFunctionQuery } from "@zachsents/fire-query"
import { useState } from "react"
import { TbArrowLeft, TbArrowRight, TbBrandGoogle, TbStarFilled } from "react-icons/tb"
import { useQuery } from "react-query"
import CTAButton from "./CTAButton"


export default function HeroSection() {


    return (
        <div className="relative bg-pg-800">
            {/* <div className="bg-pg-800 absolute top-0 -bottom-10 md:bottom-64 w-full z-[-1]" /> */}
            <div className="w-full max-w-5xl mx-auto flex flex-col text-white items-stretch px-md py-20" >
                <Group className="md:gap-20 items-start justify-center">
                    <div className="flex-1">
                        <Text className="text-center md:text-left text-pg-200 text-lg font-bold -mb-6">
                            Hey SaaS developer!
                        </Text>

                        <h1 className="text-center md:text-left text-5xl md:text-6xl font-bold">
                            Add third-party integrations to your SaaS
                        </h1>
                        <Text className="text-center md:text-left text-xl max-w-3xl">
                            WoahAuth provides dashboard and API to setup integrations, authenticate users, and get access tokens. Dead simple.
                        </Text>

                        <div className="flex justify-center md:block">
                            <CTAButton />
                        </div>
                    </div>

                    <LiveDemo />
                </Group>

                <div className="mt-10">
                    <h3 className="text-2xl text-center">
                        Hear from some happy founders
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            avatarSrc="/photos/zach-sents.jpg"
                            name="Zach Sents"
                            description="Minus | Business Automation SaaS"
                        >
                            WoahAuth is an instrumental part of our infrastructure. Without it, our product's
                            utility would be severely limited.
                        </TestimonialCard>
                        <TestimonialCard
                            avatarSrc="/photos/johnny-garcia.jpg"
                            name="Johnny Garcia"
                            description="Virtue | Software Startup Consultancy"
                        >
                            Development speed is critical for the companies we work with, and WoahAuth helps
                            us deliver.
                        </TestimonialCard>
                        <TestimonialCard
                            avatarSrc="/photos/zack-allen.jpg"
                            name="Zack Allen"
                            description="Talented | Offshore Talent Platform"
                        >
                            Being able to export lists to Google Sheets is a valuable feature for our users,
                            made possible by WoahAuth.
                        </TestimonialCard>
                    </div>
                </div>

                {/* <div id="how-it-works" className="mt-24 scroll-m-20">
                    <h3 className="text-2xl text-center">
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
                </div> */}
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


function TestimonialCard({ avatarSrc, name, description, children }) {
    return (
        <Card className="rounded-lg p-10 ">
            <Stack className="gap-sm">
                <Group noWrap className="text-yellow gap-1">
                    <TbStarFilled />
                    <TbStarFilled />
                    <TbStarFilled />
                    <TbStarFilled />
                    <TbStarFilled />
                </Group>
                <Text className="text-md">{children}</Text>
                <Group noWrap className="items-start">
                    <Avatar src={avatarSrc} className="mt-1" />
                    <div>
                        <Text className="font-bold">{name}</Text>
                        <Text className="text-sm text-gray italic">{description}</Text>
                    </div>
                </Group>
            </Stack>
        </Card>
    )
}
