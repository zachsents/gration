import BlogPostShell from "@web/components/BlogPostShell"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import fs from "fs/promises"
import { createTableOfContents, getAllPostsMeta } from "@web/modules/blog"
import rehypeSlug from "rehype-slug"


export default function BlogPost({ mdxSource, posts, meta, toc }) {
    return (
        <BlogPostShell posts={posts} meta={meta} toc={toc}>
            <MDXRemote {...mdxSource} />
        </BlogPostShell>
    )
}

export async function getStaticPaths() {

    const postFiles = await fs.readdir("posts")

    const paths = postFiles.map(file => ({
        params: { slug: file.split(".")[0] },
    }))

    return { paths, fallback: false }
}

export async function getStaticProps(context) {

    const posts = await getAllPostsMeta()

    const mdxText = await fs.readFile(`posts/${context.params.slug}.mdx`, "utf-8")
    const mdxSource = await serialize(mdxText, {
        mdxOptions: {
            rehypePlugins: [rehypeSlug],
        },
    })

    const meta = posts.find(post => post.slug === context.params.slug)
    const toc = createTableOfContents(mdxSource.compiledSource)

    return { props: { mdxSource, posts, meta, toc } }
}