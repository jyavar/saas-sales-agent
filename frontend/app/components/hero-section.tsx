"use client"

import { Button } from "@/components/ui/button"
import { Github, Play, CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32 hero-pattern" aria-label="hero" role="region">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 w-fit"
              aria-label="Beta status"
            >
              <span className="text-xs">Now in public beta</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter">
              AI Sales Agent for <br className="hidden sm:inline" />
              <span className="gradient-text">Solo SaaS Founders</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              Automated Sales Agent for Post-MVP SaaS Founders
            </p>
            <p className="max-w-[600px] text-muted-foreground">
              Deploy an AI sales team that works 24/7 with zero CAC. Connect your GitHub repo and start generating
              qualified leads in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="gradient-bg text-white" aria-label="Connect GitHub repository">
                <Link href="/signup">
                  <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                  Connect GitHub
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" aria-label="See product demo">
                <Link href="/demo">
                  <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                  See It In Action
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span className="text-sm">Zero customer acquisition cost</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span className="text-sm">No sales team required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                <span className="text-sm">Deploy in 5 minutes</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:ml-auto"
            aria-label="First week metrics visualization"
          >
            <div className="relative">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg transform rotate-1 scale-105 opacity-10 blur-xl animate-pulse"
                aria-hidden="true"
              />
              <div className="relative bg-card rounded-lg border shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <div className="space-y-6">
                    <div
                      className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                      aria-hidden="true"
                    >
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
                        className="text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M8 13h8" />
                        <path d="M8 17h8" />
                        <path d="M8 9h1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Your First Week</h3>
                      <p className="text-muted-foreground mt-1">Metrics that matter</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4" role="group" aria-label="Key metrics">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-muted-foreground text-sm">Leads Generated</p>
                        <p className="text-2xl font-bold">127</p>
                        <p className="text-green-600 text-xs flex items-center mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                            aria-hidden="true"
                          >
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                          100% from zero
                        </p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-muted-foreground text-sm">Response Rate</p>
                        <p className="text-2xl font-bold">42.3%</p>
                        <p className="text-green-600 text-xs flex items-center mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                            aria-hidden="true"
                          >
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                          3.2x industry avg
                        </p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-muted-foreground text-sm">Demo Requests</p>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-green-600 text-xs flex items-center mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                            aria-hidden="true"
                          >
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                          $0 CAC
                        </p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-muted-foreground text-sm">Time Saved</p>
                        <p className="text-2xl font-bold">37h</p>
                        <p className="text-green-600 text-xs flex items-center mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                            aria-hidden="true"
                          >
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                          Focus on building
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
