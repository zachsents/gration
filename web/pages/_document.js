import { additionalCSSVariables } from "@web/theme"
import { Head, Html, Main, NextScript } from "next/document"


export default function Document() {

    return (
        <Html lang="en">
            <Head>
                {/* Setup */}
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

                {/* Title & Description */}
                <title key="title">Never build an OAuth flow again | WoahAuth</title>
                <meta
                    name="description"
                    content="Simplify your SaaS integrations with our seamless OAuth solutions. Connect to Google, Stripe, Outlook, and more effortlessly. Elevate user experience with secure and swift connections."
                    key="description"
                />

                {/* Favicon & other icons */}
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />

                {/* OpenGraph */}
                <meta
                    property="og:title"
                    content="WoahAuth | Add third-party integrations to your SaaS"
                    key="ogtitle"
                />
                <meta
                    property="og:description"
                    content="Enrich your SaaS products by adding integrations that allow users to access their data from other platforms. Stop dealing with OAuth flows and focus on your product."
                    key="ogdescription"
                />
                <meta property="og:image" content="/og.png" />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content="WoahAuth | Add third-party integrations to your SaaS" />
                <meta property="twitter:creator" content="@Zach_Sents" />
                <meta property="twitter:image" content="/og.png" />
                <meta property="twitter:description" content="Enrich your SaaS products by adding integrations that allow users to access their data from other platforms. Stop dealing with OAuth flows and focus on your product." />

                {/* Assets */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=JetBrains+Mono:wght@300;400;500;600&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />

                {/* Global Styles */}
                <style>
                    {`html { ${additionalCSSVariables} }`}
                </style>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}