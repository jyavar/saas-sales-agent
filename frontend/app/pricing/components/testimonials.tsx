"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote: "We saw a 320% ROI in the first quarter using Strato-AI. The platform paid for itself within weeks.",
    author: "Alex Rivera",
    title: "Founder, CloudStack",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote: "The Launch plan was perfect for our needs. We've since upgraded to Scale as our company has grown.",
    author: "Priya Sharma",
    title: "CEO, DataFlow",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    quote: "Strato-AI's pricing is transparent and the value is undeniable. Best investment we've made this year.",
    author: "Thomas Wilson",
    title: "CRO, TechSprint",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function Testimonials() {
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
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">ROI You Can Expect</h2>
          <p className="mt-4 text-muted-foreground">
            Our customers consistently see significant returns on their investment with Strato-AI.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <blockquote className="text-lg mb-4">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
