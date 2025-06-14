"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Clock, LineChart, Lock, Zap } from "lucide-react"

const benefits = [
  {
    title: "Save 20+ Hours Per Week",
    description:
      "Automate repetitive sales tasks and focus on what matters most—closing deals and growing your business.",
    icon: Clock,
  },
  {
    title: "Increase Response Rates by 3x",
    description: "AI-personalized messages that resonate with your prospects and drive higher engagement.",
    icon: LineChart,
  },
  {
    title: "Close Deals Faster",
    description: "Shorten your sales cycle with intelligent follow-ups and prospect insights.",
    icon: Zap,
  },
  {
    title: "Enterprise-Grade Security",
    description: "Your data is encrypted and secure. We never share your information with third parties.",
    icon: Lock,
  },
]

export default function Benefits() {
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
    <section className="py-12 md:py-16 lg:py-20" id="benefits">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">Why Choose Strato-AI</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Our platform is designed specifically for SaaS founders who want to scale their sales efforts without hiring
            a full team.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-6 md:gap-8 md:grid-cols-2"
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="bg-card rounded-lg border p-6 h-full">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
