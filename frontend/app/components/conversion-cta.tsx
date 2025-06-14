"use client"

import type React from "react"
import { Cta } from "@/components/ui/cta"
import { routes } from "@/lib/routes"
import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ConversionCta() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

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
    <section className="py-12 md:py-16 lg:py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto"
        >
          {/* Main CTA */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Cta
              title="Ready to automate your sales outreach?"
              description="Join hundreds of solo SaaS founders who are generating qualified leads on autopilot."
              primaryAction={{
                text: "Start Free Trial",
                href: routes.signup,
              }}
              secondaryAction={{
                text: "Schedule Demo",
                href: routes.contact,
              }}
              className="mx-auto max-w-4xl"
            />
          </motion.div>

          {/* Lead Capture Form */}
          <motion.div variants={itemVariants} className="max-w-md mx-auto mb-16">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Get Early Access</h3>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Join Waitlist"}
                  </Button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    No spam. Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-center font-medium">Thanks! We'll be in touch soon.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Pricing Teaser */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-center mb-8">Simple, Transparent Pricing</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Starter Plan */}
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200 dark:border-slate-700">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
                <CardHeader className="pb-2">
                  <h4 className="text-xl font-bold">Starter</h4>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">Free</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>50 leads per month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>1 campaign</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Basic email templates</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-indigo-200 dark:border-indigo-800 shadow-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
                <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Popular
                </div>
                <CardHeader className="pb-2">
                  <h4 className="text-xl font-bold">Pro</h4>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">$49</span>
                    <span className="text-slate-500 dark:text-slate-400">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>500 leads per month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>5 campaigns</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Advanced templates + A/B testing</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Start Free Trial</Button>
                </CardFooter>
              </Card>

              {/* Scale Plan */}
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-slate-200 dark:border-slate-700">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                <CardHeader className="pb-2">
                  <h4 className="text-xl font-bold">Scale</h4>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">Custom</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Unlimited leads</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Unlimited campaigns</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
