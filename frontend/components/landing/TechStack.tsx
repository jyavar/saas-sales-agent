"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function TechStack() {
  const technologies = [
    {
      name: "OpenAI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
      category: "AI Engine",
    },
    {
      name: "Next.js",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      category: "Framework",
    },
    {
      name: "Vercel",
      logo: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png",
      category: "Hosting",
    },
    {
      name: "Supabase",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
      category: "Database",
    },
    {
      name: "GitHub",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
      category: "Integration",
    },
    {
      name: "Stripe",
      logo: "https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg",
      category: "Payments",
    },
    {
      name: "TypeScript",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      category: "Language",
    },
    {
      name: "React",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      category: "Library",
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Powered by Enterprise-Grade Infrastructure
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            See How Our AI Sales Agent Learns Your Product
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI Sales Agent reads your GitHub repository and learns to explain your product like you would—but it's
            available 24/7 to qualify leads and book demos.
          </p>
        </motion.div>

        {/* Technology Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center"
            >
              <div className="relative p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 group-hover:scale-105">
                <img
                  src={tech.logo || "/placeholder.svg"}
                  alt={`${tech.name} logo`}
                  className="h-10 w-10 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    e.currentTarget.src = `/placeholder.svg?height=40&width=40&text=${tech.name.charAt(0)}`
                  }}
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{tech.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{tech.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Technologies Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-6 gap-8 items-center"
        >
          {[
            {
              name: "Tailwind CSS",
              logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
            },
            {
              name: "PostgreSQL",
              logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
            },
            {
              name: "Docker",
              logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
            },
            {
              name: "AWS",
              logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
            },
            {
              name: "Node.js",
              logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
            },
            {
              name: "Prisma",
              logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
            },
          ].map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center"
            >
              <div className="relative p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-110">
                <img
                  src={tech.logo || "/placeholder.svg"}
                  alt={`${tech.name} logo`}
                  className="h-8 w-8 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=32&width=32&text=${tech.name.charAt(0)}`
                  }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">{tech.name}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">GitHub Native</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Connects directly to your repository for real-time product knowledge
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Code Understanding</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Analyzes your codebase to understand what you've built and explain it naturally
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Technical Founders</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Built by developers, for developers. Understands technical products deeply
            </p>
          </div>
        </motion.div>

        {/* Integration Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <Badge variant="outline" className="px-4 py-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            99.9% Uptime
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            GDPR Compliant
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            ISO 27001 Certified
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            24/7 Support
          </Badge>
        </motion.div>
      </div>
    </section>
  )
}
