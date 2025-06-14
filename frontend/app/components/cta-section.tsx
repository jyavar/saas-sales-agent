import { Cta } from "@/components/ui/cta"
import { routes } from "@/lib/routes"

export default function CtaSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <Cta
          title="Start generating qualified leads today"
          description="Connect your GitHub repository and let our AI do the rest."
          primaryAction={{
            text: "Get Started",
            href: routes.signup,
          }}
          secondaryAction={{
            text: "View Pricing",
            href: routes.pricing,
          }}
          className="mx-auto max-w-4xl"
        />
      </div>
    </section>
  )
}
