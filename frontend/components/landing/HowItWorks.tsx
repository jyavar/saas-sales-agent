"use client"

import { motion } from "framer-motion"
import { GitBranch, MessageSquare, TrendingUp } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: GitBranch,
      title: "Connect Your Repo",
      description:
        "Link your GitHub repository and let our AI analyze your product to understand what you're building.",
    },
    {
      icon: MessageSquare,
      title: "AI Learns Your Product",
      description: "Our AI studies your code, documentation, and features to become an expert on your SaaS product.",
    },
    {
      icon: TrendingUp,
      title: "Start Converting Leads",
      description: "Watch as qualified prospects turn into paying customers while you focus on building.",
    },
  ]

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Get started in minutes, not months</p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
