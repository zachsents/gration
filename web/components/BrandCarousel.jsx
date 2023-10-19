import { Carousel } from "@mantine/carousel"
import { Badge, Center, Text } from "@mantine/core"
import { useInterval } from "@mantine/hooks"
import { Services } from "@web/modules/service-clients"
import { useIsMobile } from "@web/modules/util"
import classNames from "classnames"
import { useEffect, useState } from "react"


export default function BrandCarousel({ showComingSoon = false }) {

    /** @type {[ import("@mantine/carousel").Embla, function ]} */
    const [embla, setEmbla] = useState()
    const [currentBrand, setCurrentBrand] = useState("...")
    const currentService = Services.find(service => service.name === currentBrand)

    const handleScroll = () => {
        if (embla) {
            const index = Math.floor(Math.max(0, Math.min(1, embla.scrollProgress())) * Services.length)
            setCurrentBrand(Services[index]?.name || "...")
        }
    }

    const interval = useInterval(() => {
        if (embla) {
            embla.scrollNext()
        }
    }, 1000)

    useEffect(() => {
        if (embla) {
            interval.start()
            embla.on("scroll", handleScroll)
            handleScroll()
            embla.on("pointerDown", interval.stop)
            embla.on("pointerUp", interval.start)

            return () => {
                interval.stop()
                embla.off("scroll", handleScroll)
                embla.off("pointerDown", interval.stop)
                embla.off("pointerUp", interval.start)
            }
        }
    }, [embla])

    const isMobile = useIsMobile()

    return (<>
        <div className="px-xl">
            <Text className="text-4xl md:text-7xl text-pg-600 font-bold">Integrate with your users'</Text>
            <Text className="text-5xl md:text-8xl text-primary-700 font-bold">{currentBrand}</Text>
            <Text className="text-4xl md:text-7xl text-pg-600 font-bold">account</Text>

            {showComingSoon &&
                <Badge
                    variant="outline" size="lg"
                    color={currentService?.built ? "green" : ""} className="mt-xl"
                >
                    {currentService?.built ? "Ready for beta users" : "In the works"}
                </Badge>}
        </div>

        <Center className="flex-1">
            <Carousel
                withControls={false} loop draggable dragFree
                slideSize={isMobile ? 80 : 120} slideGap={isMobile ? "md" : "xl"}
                getEmblaApi={setEmbla}
                className="w-full mt-xl md:mt-0"
            >
                {Services.filter(service => !service.hidden).map(service => (
                    <Carousel.Slide key={service.name}>
                        <Center
                            bg={showComingSoon && !service.built ? "gray" : service.color}
                            className={classNames(
                                "text-3xl md:text-6xl rounded-md w-full aspect-square",
                                showComingSoon && !service.built ? "text-gray-500" : "text-white",
                            )}
                        >
                            <service.icon strokeWidth={1.5} />
                        </Center>
                    </Carousel.Slide>
                ))}
            </Carousel>
        </Center>
    </>)
}
