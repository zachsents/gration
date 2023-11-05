import FeatureSection from "@web/components/landing/FeatureSection"
import Footer from "@web/components/landing/Footer"
import GraphicCTASection from "@web/components/landing/GraphicCTASection"
import Header from "@web/components/landing/Header"
import HeroSection from "@web/components/landing/HeroSection"
import HowItWorksSection from "@web/components/landing/HowItWorksSection"
import IntegrationsSection from "@web/components/landing/IntegrationsSection"
import PricingSection from "@web/components/landing/PricingSection"
import Head from "next/head"


export default function Landing2Page() {

    return (<>
        <Head>
            <title key="title">Add integrations to your SaaS | WoahAuth</title>
        </Head>
        <Header />
        <HeroSection />
        <FeatureSection className="mt-16" />
        <HowItWorksSection className="mt-24" />
        <IntegrationsSection className="mt-24" />
        <GraphicCTASection className="mt-24 bg-pg-800 text-white" />

        <PricingSection />

        <Footer />
    </>)
}

