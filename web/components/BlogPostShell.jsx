import { Accordion, Alert, Anchor, Button, Card, Divider, Grid, Stack, Text, Title } from "@mantine/core"
import Header from "@web/components/landing/Header"
import Link from "next/link"
import Footer from "./landing/Footer"
import { TbBook } from "react-icons/tb"


export default function BlogPostShell({ children, posts, meta, toc }) {

    const createLinks = (type) => posts.filter(post => post.type === type && !post.hidden).map(post =>
        <BlogLink
            href={`/blog/${post.slug}`}
            key={post.slug}
        >
            {post.title}
        </BlogLink>
    )

    const minHeadingOrder = Math.min(...toc.map(heading => heading.order))

    const heroImageSource = meta.heroImage === true ?
        `/post-images/${meta.slug}.png` :
        meta.heroImage

    return (<>
        <Header />
        <Grid className="w-full max-w-7xl mx-auto gap-10 py-10">
            <Grid.Col span={3}>
                <Accordion
                    variant="filled" multiple defaultValue={["tutorials", "articles"]}
                    className="sticky top-28"
                    classNames={{
                        item: "mt-xs first:mt-0 rounded-lg bg-gray-100",
                        label: "py-xs text-sm font-bold"
                    }}
                >
                    <Accordion.Item value="tutorials">
                        <Accordion.Control>Tutorials</Accordion.Control>
                        <Accordion.Panel>
                            <Stack className="gap-sm">
                                <Divider label="Usage" />
                                {createLinks("tutorial.usage")}

                                <Divider label="Services" />
                                {createLinks("tutorial.service")}
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="articles">
                        <Accordion.Control>Articles</Accordion.Control>
                        <Accordion.Panel>
                            <Stack className="gap-sm">
                                {createLinks("article")}
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Grid.Col>

            <Grid.Col span="auto" className="pt-8" key={`${meta.slug}-content`}>
                <Title order={1}>{meta.title}</Title>
                <Text className="text-sm text-gray">
                    {new Date(meta.updatedAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                    })}
                </Text>

                {meta.heroImage &&
                    <img src={heroImageSource} className="max-w-full max-h-96 rounded-lg my-6" />}

                {meta.cta &&
                    <Alert title="Complicated, right?" classNames={{ title: "text-dark" }} className="my-xl">
                        <Stack className="items-start">
                            <Text>
                                Skip the hassle and set up your integration using WoahAuth instead.
                            </Text>
                            <Button component={Link} href={`/blog/${meta.cta}`} leftIcon={<TbBook />}>
                                Learn how to do this faster with WoahAuth
                            </Button>
                        </Stack>
                    </Alert>}

                <div className="[&_*]:scroll-m-20 [&_code]:bg-gray-100 [&_code]:text-sm [&_code]:rounded-sm [&_code]:py-1 [&_code]:px-2">
                    {children}
                </div>

                {meta.otherPosts &&
                    <Stack id="other-posts" className="mt-10 scroll-m-20">
                        <Text className="font-bold">Other Posts</Text>
                        <div className="grid grid-cols-3 gap-md">
                            {meta.otherPosts.map(slug => {
                                const post = posts.find(post => post.slug === slug)
                                return (
                                    <Card component={Link} href={`/blog/${slug}`} withBorder className="rounded-lg p-md" key={slug}>
                                        <Text className="text-sm">{post.title}</Text>
                                        <Text className="text-xs text-gray">{new Date(post.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</Text>
                                    </Card>
                                )
                            })}
                        </div>
                    </Stack>}
            </Grid.Col>

            <Grid.Col span={3} key={`${meta.slug}-toc`}>
                <Stack className="gap-2 sticky top-36">
                    <Text className="text-sm font-bold">On this page</Text>
                    {toc.map(heading =>
                        <Anchor
                            component={Link} href={`#${heading.slug}`}
                            className="text-sm text-dark"
                            style={{
                                marginLeft: `${(heading.order - minHeadingOrder) * 1}rem`,
                            }}
                            key={heading.slug}
                        >
                            {heading.title}
                        </Anchor>
                    )}

                    <Anchor
                        component={Link} href="#other-posts"
                        className="text-sm text-dark"
                    >
                        Other Posts
                    </Anchor>
                </Stack>
            </Grid.Col>
        </Grid>
        <Footer />
    </>)
}


function BlogLink({ children, href }) {
    return (
        <Anchor
            component={Link}
            href={href}
            className="text-sm text-dark line-clamp-2"
        >
            {children}
        </Anchor>
    )
}