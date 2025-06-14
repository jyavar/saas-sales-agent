"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does the 14-day free trial work?",
    answer:
      "You can sign up for any plan and try all features for 14 days without being charged. No credit card is required to start your trial. At the end of your trial, you can choose to subscribe or downgrade to the free plan.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, the changes will take effect at the end of your current billing cycle.",
  },
  {
    question: "What happens if I exceed my monthly lead limit?",
    answer:
      "If you reach your monthly lead limit, you can either upgrade to a higher plan or wait until the next billing cycle when your limit resets. We'll notify you when you're approaching your limit so you can plan accordingly.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, we offer a 20% discount for annual billing on all paid plans. You can choose your billing frequency (monthly or annual) during the checkout process.",
  },
  {
    question: "Is there a setup fee?",
    answer: "No, there are no setup fees or hidden costs. The price you see is the price you pay.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. For enterprise customers, we can also arrange for bank transfers.",
  },
]

export default function FAQ() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
