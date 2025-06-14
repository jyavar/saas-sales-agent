"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TaskFlow",
      content:
        "The AI Sales Agent actually understands my product and qualifies leads better than I expected. I'm getting 2-3 qualified demo requests per week instead of random inquiries.",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      role: "Solo Founder, DevTools Pro",
      content:
        "Best part? It works while I sleep. I wake up to qualified leads who already understand what I'm building and want to book a demo. Setup took me 12 minutes.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Founder, DesignSpace",
      content:
        "My AI Sales Agent handles the initial qualification so I only talk to serious prospects. Response time went from hours to seconds, and lead quality improved dramatically.",
      rating: 5,
    },
  ]

  return (
    <section className="py-24 bg-gray-50 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Built by Founders, for Founders
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Real experiences from technical founders using Strato AI
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
