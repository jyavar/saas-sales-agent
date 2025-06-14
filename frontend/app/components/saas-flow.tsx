"use client"

import { motion } from "framer-motion"
import { GitBranch, Mail, BarChart3, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SaasFlow() {
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

  const steps = [
    {
      icon: <GitBranch className="h-8 w-8 text-blue-600" />,
      title: "Connect with GitHub",
      description:
        "Link your repositories to identify potential users and contributors who might be interested in your product.",
      color: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: <Bot className="h-8 w-8 text-purple-600" />,
      title: "Generate AI Campaigns",
      description:
        "Our AI analyzes your repositories and creates personalized outreach campaigns tailored to your audience.",
      color: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      icon: <Mail className="h-8 w-8 text-cyan-600" />,
      title: "Send Verified Emails",
      description:
        "Automatically send personalized emails to your prospects with verified deliverability and follow-up sequences.",
      color: "bg-cyan-100 dark:bg-cyan-900/20",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-amber-600" />,
      title: "Track & Optimize with AI",
      description: "Monitor campaign performance and get AI-powered recommendations to improve your results over time.",
      color: "bg-amber-100 dark:bg-amber-900/20",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">How Strato-AI Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered sales platform streamlines your outreach process from start to finish
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className={`h-20 w-20 rounded-full ${step.color} flex items-center justify-center mb-6`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform -translate-x-1/2 z-0">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-600"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Link href="/signup">Start Your First Campaign</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
