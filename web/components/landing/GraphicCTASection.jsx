import { Text } from "@mantine/core"
import CTAButton from "./CTAButton"
import Section, { SectionHeader } from "./Section"


export default function GraphicCTASection({ ...props }) {

    return (
        <Section  {...props}>
            <SectionHeader className="mb-0">
                <Text className="uppercase text-primary-800 -mb-6">Take Action</Text>
                <h3 className="text-4xl font-bold">
                    Power up your product
                </h3>
                <Text className="text-xl">
                    Add integrations. Get more users. Make more money.
                </Text>
                <Text className="text-xl mt-6">
                    What are you waiting for?
                </Text>
                <CTAButton />
            </SectionHeader>

            <div className="h-24 mt-10 md:h-64 md:-mt-4 flex justify-center overflow-clip">
                <img src="/graphics/plug-guy-long.png" alt="plug guy graphic" className="h-full" />
            </div>
        </Section>
    )
}
