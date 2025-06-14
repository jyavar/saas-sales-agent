import HeroSection from "@/components/landing/HeroSection"
import TechStack from "@/components/landing/TechStack"
import DashboardPreview from "@/components/landing/DashboardPreview"
import HowItWorks from "@/components/landing/HowItWorks"
import Benefits from "@/components/landing/Benefits"
import SaasFlow from "@/components/landing/SaasFlow"
import Testimonials from "@/components/landing/Testimonials"
import CTA from "@/components/landing/CTA"
import Navbar from "@/components/shared/Navbar"
import Footer from "@/components/shared/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      <HeroSection />
      <TechStack />
      <DashboardPreview />
      <HowItWorks />
      <Benefits />
      <SaasFlow />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
