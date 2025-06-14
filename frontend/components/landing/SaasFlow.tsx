"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function SaasFlow() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How Your AI Sales Agent Qualifies Leads
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">From visitor to qualified demo, automatically</p>
        </div>

        <div className="mt-16">
          <div className="flex flex-col items-center space-y-8 lg:flex-row lg:space-y-0 lg:space-x-8">
            {[
              "Visitor lands on your site",
              "AI Sales Agent qualifies the lead",
              "Books a qualified demo",
              "You close the deal",
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="ml-4 lg:ml-0 lg:mt-4 lg:text-center">
                  <p className="text-gray-900 dark:text-white font-medium">{step}</p>
                </div>
                {index < 3 && <ArrowRight className="ml-8 h-6 w-6 text-gray-400 hidden lg:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
