import { Button } from "@/components/ui/button"
import Link from "next/link"
import { generateMetadata } from "@/lib/seo/metadata"

export const metadata = generateMetadata({
  title: "About Us",
  description:
    "Learn about STRATO AI's mission to help solo founders convert leads into paying customers without hiring a sales team.",
  keywords: ["about STRATO AI", "AI sales company", "SaaS founders", "company mission", "AI technology"],
  canonical: "https://stratoai.com/about",
})

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About StratoAI</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 mb-8">
            StratoAI reads your GitHub repository and creates an AI sales agent that understands your product deeply—so
            you can focus on building while it handles sales conversations.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p>
            We believe that great products deserve great sales. But most technical founders struggle with sales and
            marketing, leading to amazing products that never find their audience. StratoAI bridges this gap by
            providing an AI-powered sales solution that understands your product and connects it with the right
            customers.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
          <p>
            StratoAI was founded in 2023 by a team of technical founders who experienced firsthand the challenges of
            selling a SaaS product without a dedicated sales team. After building several products that failed to gain
            traction despite positive user feedback, we realized that the problem wasn't the product—it was the sales
            approach.
          </p>
          <p className="mt-4">
            We built StratoAI to solve our own problem, and quickly realized that thousands of other solo founders and
            small teams were facing the same challenge. Today, we're helping hundreds of founders turn their MVPs into
            thriving SaaS businesses.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Technology</h2>
          <p>
            StratoAI connects directly to your GitHub repository and analyzes your code, documentation, and README files
            to understand what you've built. It then uses this knowledge to have intelligent conversations with
            prospects, explaining your product's features and benefits in a way that resonates with their specific
            needs.
          </p>
          <p className="mt-4">
            Unlike generic chatbots, our AI understands technical products and can discuss implementation details, use
            cases, and integration possibilities with the depth that technical buyers expect.
          </p>

          <div className="mt-12 flex justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              data-testid="about-cta"
            >
              <Link href="/signup" aria-label="Start your free trial of STRATO AI">
                Start Your Free Trial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
