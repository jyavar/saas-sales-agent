"use client"

import { useState, useEffect } from "react"
import { Cta } from "@/components/ui/cta"
import { routes } from "@/lib/routes"

export function StickyCtaButton() {
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const threshold = 1000 // Show after scrolling 1000px
      setShowCta(scrollPosition > threshold)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!showCta) return null

  return (
    <Cta
      variant="sticky"
      title="Ready to get started?"
      primaryAction={{
        text: "Start Free Trial",
        href: routes.signup,
      }}
    />
  )
}
