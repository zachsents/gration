import { Divider, Group, Highlight, Stack, Text, ThemeIcon } from "@mantine/core"
import Section, { SectionHeader } from "@web/components/landing/Section"
import { TbBrandAirtable } from "react-icons/tb"


export default function FeatureSection({ ...props }) {
    return (
        <Section id="how-it-works" {...props}>
            <SectionHeader>
                <h2 className="text-5xl font-bold">
                    The only tool to easily integrate with third-party services
                </h2>
                <Text className="text-xl">
                    Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated.
                </Text>
            </SectionHeader>

            <Stack className="gap-36">
                <Feature
                    title="Users bring their own data"
                    highlight={["data"]}
                    description="Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated."
                    graphic={<img src="/graphics/desk.png" alt="desk graphic" className="max-w-full" />}
                >
                    <Group noWrap className="gap-md">
                        <ThemeIcon color="pg" size="xl" className="rounded-full">
                            <TbBrandAirtable />
                        </ThemeIcon>
                        <Text className="text-lg">
                            Tons of integrations
                        </Text>
                    </Group>
                </Feature>
                <Feature
                    title="Users bring their own data"
                    highlight={["data"]}
                    description="Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated."
                    graphic={<img src="/graphics/connect.png" alt="connect graphic" className="max-w-full" />}
                />
                <Feature
                    title="Users bring their own data"
                    highlight={["data"]}
                    description="Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated."
                    graphic={<img src="/graphics/coding.png" alt="coding graphic" className="max-w-full" />}
                />
            </Stack>
        </Section>
    )
}


function Feature({ graphic, title, description, highlight = [], children }) {

    return (
        <Group grow className="w-full gap-16 even:flex-row-reverse">
            <div className="flex-1">
                {title &&
                    <Highlight
                        component="h3"
                        highlight={highlight}
                        className="text-3xl font-bold mt-0"
                        highlightStyles={theme => ({
                            color: theme.colors.primary[8],
                            backgroundColor: "transparent",
                        })}
                    >
                        {title}
                    </Highlight>}
                {description &&
                    <Text className="text-xl">
                        {description}
                    </Text>}

                {(title || description) && children &&
                    <Divider className="my-6 w-32" />}

                {children}
            </div>
            <div className="flex-1 min-w-0 rounded-xl overflow-clip">
                {graphic}
            </div>
        </Group>
    )
}