"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const plans = [
  {
    name: "Freemium",
    description: "Perfect for trying out Strato-AI.",
    price: "$0",
    priceDescription: "Free forever",
    features: ["50 leads per month", "1 campaign", "Basic email templates", "GitHub integration", "Email tracking"],
    cta: "Get Started",
    ctaLink: "/signup",
    popular: false,
  },
  {
    name: "Launch",
    description: "For early-stage SaaS companies.",
    price: "$99",
    priceDescription: "per month",
    features: [
      "500 leads per month",
      "5 campaigns",
      "Advanced email templates",
      "GitHub & LinkedIn integration",
      "Email tracking & analytics",
      "A/B testing",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    ctaLink: "/signup",
    popular: true,
    roi: "Average ROI: 5.2x",
  },
  {
    name: "Scale",
    description: "For growing SaaS companies.",
    price: "$299",
    priceDescription: "per month",
    features: [
      "Unlimited leads",
      "Unlimited campaigns",
      "Custom email templates",
      "All integrations",
      "Advanced analytics",
      "A/B testing",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Start 14-day trial",
    ctaLink: "/signup",
    popular: false,
    roi: "Average ROI: 7.8x",
  },
]

export default function PricingTable() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-10">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className={`h-full flex flex-col ${plan.popular ? "border-blue-600 shadow-lg" : ""}`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.popular && <Badge className="gradient-bg">Most Popular</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.priceDescription}</span>
                    {plan.roi && <p className="text-green-600 dark:text-green-500 text-sm mt-1">{plan.roi}</p>}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-blue-600 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className={`w-full ${plan.popular ? "gradient-bg" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
