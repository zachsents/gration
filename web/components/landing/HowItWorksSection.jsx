import { Center, Divider, Group, Highlight, Stack, Text, useMantineTheme } from "@mantine/core"
import { useIntersection } from "@mantine/hooks"
import Section, { SectionHeader } from "@web/components/landing/Section"
import classNames from "classnames"
import CTAButton from "./CTAButton"


export default function HowItWorksSection({ ...props }) {
    return (
        <Section id="how-it-works" {...props}>
            <SectionHeader>
                <h3 className="text-4xl font-bold text-center">
                    Up & Running in 5 Minutes
                </h3>
                {/* <Text className="text-xl">
                    All you need is your credentials from the integration provider and a few lines of code.
                </Text> */}
            </SectionHeader>


            <Stack className="gap-20">
                <Step
                    index={1}
                    title="Paste in your OAuth client config"
                    description="from Google Cloud Console, GitHub Developer Settings, etc."
                    graphic={<img src="/graphics/step-1.png" className="max-w-full" />}
                />
                <Step
                    index={2}
                    title="Send users to your custom authorization link"
                    description="where they can sign in through the integration provider."
                    graphic={<img src="/graphics/step-2.png" className="max-w-full" />}
                />
                <Step
                    index={3}
                    title="Use the API to retrieve fresh tokens"
                    description="and never worry about token storage, refreshing, PKCE challenges, or really anything."
                    graphic={<img src="/graphics/step-3.png" className="max-w-full" />}
                />
            </Stack>

            <Center className="mt-10">
                <CTAButton gradient={false} />
            </Center>
        </Section>
    )
}


function Step({ index, graphic, title, description, highlight = [], children }) {

    const theme = useMantineTheme()

    const { ref, entry } = useIntersection({
        threshold: 1,
    })

    return (
        <Group className="w-full gap-10 md:gap-16 flex-col-reverse md:flex-row">
            <Center className={classNames(
                "text-7xl h-[1.5em] aspect-square rounded-full transition hidden md:flex",
                entry?.isIntersecting ? "bg-primary-500" : "opacity-50"
            )}>
                <Text>
                    {index}
                </Text>
            </Center>
            <div className="md:flex-1">
                {title &&
                    <h4 className="text-3xl font-bold mt-0 mb-4 text-center [&_*]:leading-none md:text-left">
                        <span className="md:hidden">{index}.{" "}</span>
                        <Highlight
                            component="span"
                            highlight={highlight}
                            highlightStyles={theme => ({
                                color: theme.colors.primary[8],
                                backgroundColor: "transparent",
                            })}
                        >
                            {title}
                        </Highlight>
                    </h4>}
                {description &&
                    <Text className="text-xl text-center md:text-left">
                        {description}
                    </Text>}

                {(title || description) && children &&
                    <Divider className="my-6 w-32 mx-auto md:mx-0" />}

                {children}
            </div>
            <div
                className={classNames(
                    "md:flex-1 md:min-w-0 rounded-xl overflow-clip transition",
                    entry?.isIntersecting ? "md:opacity-100 md:scale-110" : "md:opacity-50 md:scale-100",
                )}
                ref={ref}
                style={{
                    background: `linear-gradient(${theme.colors.pg[3]}, ${theme.colors.pg[6]})`,
                }}
            >
                {graphic}
            </div>
        </Group>
    )
}