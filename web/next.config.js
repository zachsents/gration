const withMDX = require("@next/mdx")()

const nextConfig = {
    reactStrictMode: true,
    transpilePackages: [],
    output: "export",
    productionBrowserSourceMaps: true,
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

module.exports = withMDX(nextConfig)
