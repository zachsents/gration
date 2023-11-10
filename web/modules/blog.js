import fs from "fs/promises"


export async function getAllPostsMeta() {
    const postFiles = await fs.readdir("posts")

    return await Promise.all(
        postFiles.map(async file => {
            const { meta } = await import(`../posts/${file}`)
            return { ...meta, slug: file.split(".")[0] }
        })
    )
}


export function createTableOfContents(mdxSource) {
    const headings = [...mdxSource.matchAll(/h(\d),.+?id: "([\w-]+)".+?children: "(.+?)"/gs)].map(match => ({
        order: parseInt(match[1]),
        slug: match[2],
        title: match[3],
    }))

    return headings
}