import FeatureSection from "@web/components/landing/FeatureSection"
import Footer from "@web/components/landing/Footer"
import GraphicCTASection from "@web/components/landing/GraphicCTASection"
import Header from "@web/components/landing/Header"
import HeroSection from "@web/components/landing/HeroSection"
import IntegrationsSection from "@web/components/landing/IntegrationsSection"
import PricingSection from "@web/components/landing/PricingSection"


export default function Landing2Page() {


    return (<>
        <Header />
        <HeroSection />
        <FeatureSection className="mt-16" />
        <IntegrationsSection />
        <GraphicCTASection className="mt-24 bg-pg-800 text-white" />

        <PricingSection />

        <Footer />
    </>)
}

