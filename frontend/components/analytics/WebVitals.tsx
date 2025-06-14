"use client"

import { useEffect } from "react"
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals"

function sendToAnalytics(metric: any) {
  // En producción, enviar a tu servicio de analytics
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vital:", metric)
  }

  // Ejemplo: Google Analytics 4
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_category: "Web Vitals",
      event_label: metric.id,
      non_interaction: true,
    })
  }
}

export function WebVitals() {
  useEffect(() => {
    getCLS(sendToAnalytics)
    getFID(sendToAnalytics)
    getFCP(sendToAnalytics)
    getLCP(sendToAnalytics)
    getTTFB(sendToAnalytics)
  }, [])

  return null
}
