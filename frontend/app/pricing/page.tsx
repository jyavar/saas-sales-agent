import PricingHero from "@/app/pricing/components/pricing-hero"
import PricingTable from "@/app/pricing/components/pricing-table"
import Testimonials from "@/app/pricing/components/testimonials"
import FAQ from "@/app/pricing/components/faq"
import BottomCTA from "@/app/pricing/components/bottom-cta"
import { generateMetadata } from "@/lib/seo/metadata"

export const metadata = generateMetadata({
  title: "Pricing Plans",
  description: "Choose the perfect STRATO AI plan for your business. Simple, transparent pricing with no hidden fees.",
  keywords: ["pricing", "subscription plans", "SaaS pricing", "AI sales agent pricing"],
  canonical: "https://stratoai.com/pricing",
})

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <PricingHero />
      <PricingTable />
      <Testimonials />
      <FAQ />
      <BottomCTA />
    </main>
  )
}
