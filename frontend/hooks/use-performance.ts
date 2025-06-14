"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstPaint: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({})

  useEffect(() => {
    if (typeof window === "undefined") return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case "navigation":
            const navEntry = entry as PerformanceNavigationTiming
            setMetrics((prev) => ({
              ...prev,
              loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            }))
            break

          case "paint":
            if (entry.name === "first-paint") {
              setMetrics((prev) => ({ ...prev, firstPaint: entry.startTime }))
            } else if (entry.name === "first-contentful-paint") {
              setMetrics((prev) => ({ ...prev, firstContentfulPaint: entry.startTime }))
            }
            break

          case "largest-contentful-paint":
            setMetrics((prev) => ({ ...prev, largestContentfulPaint: entry.startTime }))
            break

          case "first-input":
            setMetrics((prev) => ({ ...prev, firstInputDelay: (entry as any).processingStart - entry.startTime }))
            break

          case "layout-shift":
            if (!(entry as any).hadRecentInput) {
              setMetrics((prev) => ({
                ...prev,
                cumulativeLayoutShift: (prev.cumulativeLayoutShift || 0) + (entry as any).value,
              }))
            }
            break
        }
      }
    })

    observer.observe({ entryTypes: ["navigation", "paint", "largest-contentful-paint", "first-input", "layout-shift"] })

    return () => observer.disconnect()
  }, [])

  return metrics
}
