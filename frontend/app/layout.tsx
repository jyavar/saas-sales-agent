import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Strato AI - AI Sales Agent for Solo Founders",
  description: "Automate your sales process with AI. Perfect for solo founders who want to scale without hiring.",
  keywords: "AI sales agent, solo founder, sales automation, lead generation",
  authors: [{ name: "Strato AI" }],
  openGraph: {
    title: "Strato AI - AI Sales Agent for Solo Founders",
    description: "Automate your sales process with AI. Perfect for solo founders who want to scale without hiring.",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
