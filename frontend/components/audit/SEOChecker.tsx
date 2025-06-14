"use client"

import { useEffect, useState } from "react"

interface SEOIssue {
  type: "error" | "warning" | "info"
  message: string
  recommendation?: string
}

export function SEOChecker() {
  const [issues, setIssues] = useState<SEOIssue[]>([])

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    const checkSEO = () => {
      const foundIssues: SEOIssue[] = []

      // Verificar título
      const title = document.querySelector("title")
      if (!title || !title.textContent) {
        foundIssues.push({
          type: "error",
          message: "Missing page title",
          recommendation: "Add a descriptive title tag",
        })
      } else if (title.textContent.length > 60) {
        foundIssues.push({
          type: "warning",
          message: "Title too long (>60 characters)",
          recommendation: "Keep title under 60 characters",
        })
      }

      // Verificar meta description
      const metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc || !metaDesc.getAttribute("content")) {
        foundIssues.push({
          type: "error",
          message: "Missing meta description",
          recommendation: "Add a meta description tag",
        })
      } else {
        const content = metaDesc.getAttribute("content") || ""
        if (content.length > 160) {
          foundIssues.push({
            type: "warning",
            message: "Meta description too long (>160 characters)",
            recommendation: "Keep meta description under 160 characters",
          })
        }
      }

      // Verificar H1
      const h1s = document.querySelectorAll("h1")
      if (h1s.length === 0) {
        foundIssues.push({
          type: "error",
          message: "Missing H1 tag",
          recommendation: "Add exactly one H1 tag per page",
        })
      } else if (h1s.length > 1) {
        foundIssues.push({
          type: "warning",
          message: "Multiple H1 tags found",
          recommendation: "Use only one H1 tag per page",
        })
      }

      // Verificar Open Graph
      const ogTitle = document.querySelector('meta[property="og:title"]')
      const ogDesc = document.querySelector('meta[property="og:description"]')
      const ogImage = document.querySelector('meta[property="og:image"]')

      if (!ogTitle) {
        foundIssues.push({
          type: "warning",
          message: "Missing Open Graph title",
          recommendation: "Add og:title meta tag for social sharing",
        })
      }

      if (!ogDesc) {
        foundIssues.push({
          type: "warning",
          message: "Missing Open Graph description",
          recommendation: "Add og:description meta tag for social sharing",
        })
      }

      if (!ogImage) {
        foundIssues.push({
          type: "warning",
          message: "Missing Open Graph image",
          recommendation: "Add og:image meta tag for social sharing",
        })
      }

      // Verificar canonical
      const canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        foundIssues.push({
          type: "info",
          message: "Missing canonical URL",
          recommendation: "Add canonical link to prevent duplicate content issues",
        })
      }

      setIssues(foundIssues)
    }

    setTimeout(checkSEO, 1000)
  }, [])

  if (process.env.NODE_ENV !== "development" || issues.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 max-w-sm bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50">
      <h3 className="font-bold text-blue-800 mb-2">SEO Issues Found</h3>
      <ul className="space-y-2 text-sm">
        {issues.slice(0, 3).map((issue, index) => (
          <li key={index} className="space-y-1">
            <div
              className={
                issue.type === "error" ? "text-red-700" : issue.type === "warning" ? "text-orange-700" : "text-blue-700"
              }
            >
              {issue.type === "error" ? "❌" : issue.type === "warning" ? "⚠️" : "ℹ️"} {issue.message}
            </div>
            {issue.recommendation && <div className="text-xs text-gray-600 pl-4">💡 {issue.recommendation}</div>}
          </li>
        ))}
      </ul>
      {issues.length > 3 && <p className="text-xs text-blue-600 mt-2">+{issues.length - 3} more issues</p>}
    </div>
  )
}
