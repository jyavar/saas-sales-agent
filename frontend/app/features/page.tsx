import { generateMetadata } from "@/lib/seo/metadata"
import FeaturesClientPage from "./FeaturesClientPage"

export const metadata = generateMetadata({
  title: "Features",
  description:
    "Discover how STRATO AI transforms your sales process with intelligent automation, personalized outreach, and data-driven insights.",
  keywords: ["AI features", "sales automation", "GitHub integration", "lead scoring", "email outreach"],
  canonical: "https://stratoai.com/features",
})

export default function FeaturesPage() {
  return <FeaturesClientPage />
}
