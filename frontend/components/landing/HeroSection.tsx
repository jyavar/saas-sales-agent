"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Users, TrendingUp, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroSection() {
  const scrollToDashboard = () => {
    const dashboardSection = document.getElementById("dashboard-preview")
    dashboardSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden pt-20 pb-8 sm:pt-24 sm:pb-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

      {/* Simple dot pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              Turn GitHub Repos into{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Paying Customers
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
              Let our AI Sales Agent qualify leads, reply to prospects, and book demos—so you can focus on building. No
              sales team needed.
            </p>

            <p className="mt-4 text-base text-gray-500 dark:text-gray-400 font-medium">
              Trained on your product. Responds like a founder.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToDashboard}>
                See Dashboard Demo
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No credit card needed</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Always Active</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Solo</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Founder Focused</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Faster</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Times</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
