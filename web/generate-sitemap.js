const fs = require("fs/promises")
const path = require("path")


const DOMAIN = "https://woahauth.com"


async function crawlDir(dir, rootDir = dir) {
    if (!dir)
        return []

    const dirContents = await fs.readdir(dir, { withFileTypes: true })

    const results = await Promise.all(
        dirContents.filter(entry => !/[[\]]/.test(entry.name) && !entry.name.startsWith("_"))
            .map(async entry => {
                if (entry.isDirectory())
                    return crawlDir(path.join(dir, entry.name), rootDir)

                const relPath = path.join(dir, entry.name)
                const stat = await fs.stat(relPath)

                const isIndex = /^index\./.test(entry.name)

                return {
                    path: path.relative(
                        rootDir,
                        isIndex ? dir : path.join(dir, entry.name)
                    ).replace(/\.\w+?$/, "").replaceAll("\\", "/"),
                    lastModified: stat.mtime.toISOString(),
                }
            })
    )

    return results.flat()
}


crawlDir("./pages").then(async entries => {
    const urlComponents = entries.map(entry =>
        `        <url>
            <loc>${DOMAIN}/${entry.path}</loc>
            <lastmod>${entry.lastModified}</lastmod>
        </url>`
    ).join("\n")

    const sitemap = `<xml version="1.0" encoding="UTF-8">
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlComponents}
    </urlset>
</xml>`

    await fs.writeFile("./public/sitemap.xml", sitemap)
    console.debug("Sitemap generated")
})
