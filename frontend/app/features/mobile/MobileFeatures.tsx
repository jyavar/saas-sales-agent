"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check } from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  benefits: string[]
  details?: string
}

interface MobileFeaturesProps {
  features: Feature[]
}

export default function MobileFeatures({ features }: MobileFeaturesProps) {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const [visibleFeatures, setVisibleFeatures] = useState<Set<string>>(new Set())

  // Intersection Observer para lazy loading
  const { ref: observerRef } = useIntersectionObserver({
    threshold: 0.1,
    onIntersect: useCallback((entry) => {
      const featureId = entry.target.getAttribute("data-feature-id")
      if (featureId) {
        setVisibleFeatures((prev) => new Set([...prev, featureId]))
      }
    }, []),
  })

  const toggleFeature = useCallback((featureId: string) => {
    setExpandedFeature((prev) => (prev === featureId ? null : featureId))
  }, [])

  return (
    <div className="space-y-4 p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Features</h1>
        <p className="text-muted-foreground text-sm">Discover what makes Strato AI powerful</p>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            ref={observerRef}
            data-feature-id={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={visibleFeatures.has(feature.id) ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleFeature(feature.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-sm">{feature.title}</CardTitle>
                      <CardDescription className="text-xs">{feature.description}</CardDescription>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedFeature === feature.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {expandedFeature === feature.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-start space-x-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">{benefit}</span>
                          </div>
                        ))}

                        {feature.details && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground">{feature.details}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA optimizado para móvil */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <div className="text-center space-y-3">
          <h3 className="font-semibold text-sm">Ready to get started?</h3>
          <p className="text-xs text-muted-foreground">Join thousands of companies using Strato AI</p>
          <Button size="sm" className="w-full">
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  )
}
