"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, MessageSquare, Zap, Target, BarChart3, Clock, ArrowRight, CheckCircle } from "lucide-react"

export default function FeaturesClientPage() {
  const features = [
    {
      icon: Github,
      title: "GitHub Integration",
      description:
        "Connects directly to your repository to understand your product's features, documentation, and codebase.",
      benefits: ["Automatic product knowledge", "Real-time updates", "No manual setup required"],
    },
    {
      icon: MessageSquare,
      title: "Intelligent Conversations",
      description: "AI that understands technical products and can discuss implementation details with prospects.",
      benefits: ["Technical depth", "Personalized responses", "Context-aware discussions"],
    },
    {
      icon: Zap,
      title: "24/7 Response",
      description: "Never miss a lead again. Your AI sales agent works around the clock to engage prospects.",
      benefits: ["Instant responses", "Global availability", "Consistent messaging"],
    },
    {
      icon: Target,
      title: "Lead Qualification",
      description: "Automatically identifies and prioritizes high-quality leads based on their engagement and needs.",
      benefits: ["Smart scoring", "Priority routing", "Quality filtering"],
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track conversations, conversion rates, and revenue attribution with detailed analytics.",
      benefits: ["Real-time metrics", "Conversion tracking", "ROI insights"],
    },
    {
      icon: Clock,
      title: "Quick Setup",
      description:
        "Get started in minutes, not weeks. Connect your GitHub repo and start converting leads immediately.",
      benefits: ["5-minute setup", "No technical knowledge required", "Instant deployment"],
    },
  ]

  const useCases = [
    {
      title: "Developer Tools",
      description: "Perfect for APIs, SDKs, and developer-focused products that need technical explanations.",
      icon: "🛠️",
    },
    {
      title: "SaaS Platforms",
      description: "Ideal for B2B SaaS products that require detailed feature discussions and demos.",
      icon: "💼",
    },
    {
      title: "Open Source Projects",
      description: "Great for monetizing open source projects with commercial offerings.",
      icon: "🌟",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Product Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Everything Your AI Sales Agent{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Can Do</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              See how your AI Sales Agent qualifies leads, books demos, and handles prospect conversations so you can
              focus on building your product.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Solo Founders
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built specifically for technical founders who want to scale sales without hiring a team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                      <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perfect for Your Product Type
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Strato AI works exceptionally well with technical products that need detailed explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{useCase.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect GitHub",
                description: "Link your repository and let our AI analyze your product's features and documentation.",
                icon: Github,
              },
              {
                step: "02",
                title: "AI Learns",
                description: "Our AI studies your code and creates intelligent responses about your product.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Start Converting",
                description: "Watch as qualified prospects turn into customers while you focus on building.",
                icon: Target,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">STEP {step.step}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Sales Process?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of technical founders who've turned their GitHub repositories into revenue-generating
              machines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                View Pricing
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-4">No credit card required • Setup in 5 minutes • Cancel anytime</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
