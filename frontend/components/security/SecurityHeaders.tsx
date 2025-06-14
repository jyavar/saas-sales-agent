"use client"

import { useEffect } from "react"

export function SecurityAudit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    const checkSecurity = () => {
      const issues: string[] = []

      // Verificar HTTPS
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        issues.push("Site not served over HTTPS")
      }

      // Verificar CSP
      const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]')
      if (!csp) {
        issues.push("Missing Content Security Policy")
      }

      // Verificar formularios
      const forms = document.querySelectorAll("form")
      forms.forEach((form, index) => {
        if (!form.getAttribute("novalidate") && !form.querySelector("input[required]")) {
          issues.push(`Form ${index + 1} missing validation`)
        }
      })

      // Verificar enlaces externos
      const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="stratoai.com"])')
      externalLinks.forEach((link, index) => {
        if (!link.getAttribute("rel")?.includes("noopener")) {
          issues.push(`External link ${index + 1} missing rel="noopener"`)
        }
      })

      if (issues.length > 0) {
        console.warn("Security issues found:", issues)
      }
    }

    setTimeout(checkSecurity, 1000)
  }, [])

  return null
}
