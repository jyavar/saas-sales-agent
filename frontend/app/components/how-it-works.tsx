"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Brain, Mail, Users, Zap } from "lucide-react"

const steps = [
  {
    title: "Connect Your GitHub",
    description: "Link your GitHub repository to identify potential leads based on stars, forks, and contributions.",
    icon: Brain,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    title: "AI Analyzes Your Product",
    description: "Our AI scans your codebase and documentation to understand your product and target audience.",
    icon: Zap,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    title: "Generate Personalized Campaigns",
    description: "Create tailored outreach campaigns that speak directly to your prospects' needs and pain points.",
    icon: Mail,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300",
  },
  {
    title: "Convert Leads to Customers",
    description: "Track responses, schedule meetings, and close deals with our integrated sales pipeline.",
    icon: Users,
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300",
  },
]

export default function HowItWorks() {
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
    <section className="py-12 md:py-16 lg:py-20 bg-muted/30" id="how-it-works">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">How It Works</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Our AI-powered platform streamlines your sales process from lead generation to closing deals.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              <div className="bg-card rounded-lg border p-6 h-full flex flex-col">
                <div className={`${step.color} h-12 w-12 rounded-lg flex items-center justify-center mb-4`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
