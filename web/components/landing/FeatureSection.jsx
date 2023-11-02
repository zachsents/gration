import { Divider, Group, Highlight, Stack, Text, ThemeIcon } from "@mantine/core"
import Section, { SectionHeader } from "@web/components/landing/Section"
import classNames from "classnames"
import { useMemo } from "react"
import { TbBrandAirtable, TbBrandGithub, TbBrandGoogle, TbPlus } from "react-icons/tb"


export default function FeatureSection({ ...props }) {
    return (
        <Section {...props}>
            <SectionHeader>
                <h2 className="text-4xl md:text-5xl font-bold">
                    The only tool to easily integrate with third-party services
                </h2>
                <Text className="text-xl">
                    Building valuable SaaS tools means integrating with your users' data, but adding third-party integrations is complicated.
                </Text>
            </SectionHeader>

            <Stack className="gap-36">
                <Feature
                    title="Empower your users with access to their own data"
                    highlight={["Empower", "users", "data"]}
                    description="Provide your users with a personalized, data-rich experience that keeps them engaged and productive."
                    graphic={<img src="/graphics/connect.png" alt="connect graphic" className="max-w-full" />}
                >
                    <BarChartDecoration amount={50} />
                </Feature>
                <Feature
                    title="Broaden your eligible userbase"
                    highlight={["Broaden", "userbase"]}
                    description="You access a whole new world of potential users by integrating universally-utilized platforms like Google, Airtable, and GitHub into your SaaS."
                    graphic={<img src="/graphics/announce.png" alt="announce graphic" className="max-w-full" />}
                >
                    <Group noWrap className="gap-md">
                        <IconGroup icons={[TbBrandGoogle, TbBrandAirtable, TbBrandGithub, TbPlus]} />

                        <Text className="text-sm">
                            More integrations = More addressable users
                        </Text>
                    </Group>
                </Feature>
                <Feature
                    title="Save hours and eliminate complexity"
                    highlight={["Save hours"]}
                    description="Integrations traditionally require hours of development time, hundreds of lines of code, and a deep understanding of OAuth protocols. WoahAuth eliminates all of that."
                    graphic={<img src="/graphics/coding.png" alt="coding graphic" className="max-w-full" />}
                >
                    <Group className="justify-center md:justify-start">
                        <Group className="px-4 py-2 bg-blue-100 rounded-md text-blue-800">
                            <Text>+7 hours saved</Text>
                        </Group>
                        <Group className="gap-md [&_*]:font-mono py-2 px-4 bg-gray-100 rounded-md">
                            <Text className="text-gray">Pull Request:</Text>
                            <Text className="text-green">+8</Text>
                            <Text className="text-red">-462</Text>
                        </Group>
                    </Group>
                </Feature>
            </Stack>
        </Section>
    )
}


function Feature({ graphic, title, description, highlight = [], children }) {

    return (
        <Group className="w-full gap-16 flex-col-reverse md:flex-row md:even:flex-row-reverse">
            <div className="md:flex-1">
                {title &&
                    <Highlight
                        component="h3"
                        highlight={highlight}
                        className="text-3xl font-bold mt-0 text-center md:text-left"
                        highlightStyles={theme => ({
                            color: theme.colors.primary[8],
                            backgroundColor: "transparent",
                        })}
                    >
                        {title}
                    </Highlight>}
                {description &&
                    <Text className="text-xl text-center md:text-left">
                        {description}
                    </Text>}

                {(title || description) && children &&
                    <Divider className="my-6 w-32 mx-auto md:mx-0" />}

                {children}
            </div>
            <div className="md:flex-1 md:min-w-0 rounded-xl overflow-clip">
                {graphic}
            </div>
        </Group>
    )
}


function IconGroup({ icons = [], className, ...props }) {
    return (
        <Group noWrap>
            {icons.map((Icon, i) =>
                <ThemeIcon
                    color="pg" size="xl" className={classNames("rounded-full -ml-7 first:ml-0 outline outline-2 outline-white", className)}
                    {...props}
                    key={i}
                >
                    <Icon />
                </ThemeIcon>
            )}
        </Group>
    )
}


function BarChartDecoration({ amount = 10 }) {

    const heights = useMemo(() => Array(amount).fill().map(() => `${Math.floor(Math.random() * 100)}%`), [amount])

    return (
        <div className="flex gap-1 h-8 items-end">
            {heights.map((height, i) =>
                <div key={i} className="flex-1 bg-pg-100" style={{ height }} />
            )}
        </div>
    )
}