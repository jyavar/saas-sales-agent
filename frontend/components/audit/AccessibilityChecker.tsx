"use client"

import { useEffect, useState } from "react"

interface A11yIssue {
  type: "error" | "warning"
  message: string
  element?: string
}

export function AccessibilityChecker() {
  const [issues, setIssues] = useState<A11yIssue[]>([])

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    const checkAccessibility = () => {
      const foundIssues: A11yIssue[] = []

      // Verificar imágenes sin alt
      const images = document.querySelectorAll("img:not([alt])")
      images.forEach((img, index) => {
        foundIssues.push({
          type: "error",
          message: `Image ${index + 1} missing alt attribute`,
          element: img.tagName.toLowerCase(),
        })
      })

      // Verificar botones sin texto accesible
      const buttons = document.querySelectorAll("button")
      buttons.forEach((button, index) => {
        const hasText = button.textContent?.trim()
        const hasAriaLabel = button.getAttribute("aria-label")
        const hasAriaLabelledBy = button.getAttribute("aria-labelledby")

        if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
          foundIssues.push({
            type: "error",
            message: `Button ${index + 1} has no accessible text`,
            element: "button",
          })
        }
      })

      // Verificar headings en orden
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      let lastLevel = 0
      headings.forEach((heading, index) => {
        const level = Number.parseInt(heading.tagName.charAt(1))
        if (level > lastLevel + 1) {
          foundIssues.push({
            type: "warning",
            message: `Heading level ${level} skips level ${lastLevel + 1}`,
            element: heading.tagName.toLowerCase(),
          })
        }
        lastLevel = level
      })

      // Verificar contraste de color (simplificado)
      const elements = document.querySelectorAll("*")
      elements.forEach((element) => {
        const styles = window.getComputedStyle(element)
        const color = styles.color
        const backgroundColor = styles.backgroundColor

        // Aquí podrías implementar un verificador de contraste más sofisticado
        if (color === "rgb(128, 128, 128)" && backgroundColor === "rgb(255, 255, 255)") {
          foundIssues.push({
            type: "warning",
            message: "Potential low contrast detected",
            element: element.tagName.toLowerCase(),
          })
        }
      })

      setIssues(foundIssues)
    }

    // Ejecutar después de que el DOM esté completamente cargado
    setTimeout(checkAccessibility, 1000)
  }, [])

  if (process.env.NODE_ENV !== "development" || issues.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-bold text-red-800 mb-2">Accessibility Issues Found</h3>
      <ul className="space-y-1 text-sm">
        {issues.slice(0, 5).map((issue, index) => (
          <li key={index} className={issue.type === "error" ? "text-red-700" : "text-orange-700"}>
            {issue.type === "error" ? "❌" : "⚠️"} {issue.message}
          </li>
        ))}
      </ul>
      {issues.length > 5 && <p className="text-xs text-red-600 mt-2">+{issues.length - 5} more issues</p>}
    </div>
  )
}
