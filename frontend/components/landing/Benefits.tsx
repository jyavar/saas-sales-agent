"use client"

import { motion } from "framer-motion"
import { Clock, DollarSign, Users, Zap } from "lucide-react"

export default function Benefits() {
  const benefits = [
    {
      icon: Clock,
      title: "Qualifies Leads 24/7",
      description: "AI Sales Agent asks the right questions and identifies serious prospects while you sleep.",
    },
    {
      icon: DollarSign,
      title: "Books Qualified Demos",
      description: "Automatically schedules calls with prospects who are ready to buy, not just browsing.",
    },
    {
      icon: Users,
      title: "Responds Like You Would",
      description: "Trained on your product knowledge. Answers technical questions with founder-level depth.",
    },
    {
      icon: Zap,
      title: "Setup in 10 Minutes",
      description: "Connect GitHub, review responses, go live. Your AI Sales Agent starts working immediately.",
    },
  ]

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Watch How Our AI Sales Agent Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Everything you need to qualify leads without a sales team
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
