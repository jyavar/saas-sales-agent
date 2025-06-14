import type React from "react"
import { cn } from "@/lib/utils"

type GridVariant = "standard" | "wide" | "metrics" | "contentWithSidebar"

interface ResponsiveGridProps {
  children: React.ReactNode
  variant?: GridVariant
  className?: string
}

export function ResponsiveGrid({ children, variant = "standard", className }: ResponsiveGridProps) {
  const gridClasses = {
    standard: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    wide: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
    metrics: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
    contentWithSidebar: "grid grid-cols-1 lg:grid-cols-12 gap-6",
  }

  return <div className={cn(gridClasses[variant], className)}>{children}</div>
}
