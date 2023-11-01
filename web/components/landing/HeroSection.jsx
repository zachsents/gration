import { Button, Text } from "@mantine/core"
import Link from "next/link"
import { useUser } from "reactfire"


export default function HeroSection() {

    const { data: user } = useUser()

    return (
        <div className="relative">
            <div className="bg-pg-800 h-[calc(100vh+10rem)] absolute top-0 w-full z-[-1]" />
            <div className="w-full max-w-5xl mx-auto flex flex-col text-white items-center pt-20" >
                <h1 className="text-center text-5xl md:text-6xl font-bold">
                    Add integrations to your SaaS
                </h1>
                <Text className="text-center text-xl max-w-3xl">
                    Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated.
                </Text>

                <Button
                    size="lg" className="scale-125 md:scale-100 mt-10 mb-16 rounded-lg"
                    component={Link} href={user ? "/dashboard" : "/login?register"}
                >
                    Start now
                </Button>

                <div className="hidden md:block w-full rounded-xl p-xl bg-orange-400">
                    <img src="/graphics/demo-diagram.png" className="w-full" />
                </div>

                <div className="md:hidden w-full h-[24rem] px-xs">
                    <div className="w-full h-full rounded-xl p-xl bg-orange-400 overflow-scroll">
                        <img src="/graphics/demo-diagram.png" className="w-[200vw]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
