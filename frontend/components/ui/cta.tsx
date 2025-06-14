import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CtaProps {
  title: string
  description?: string
  primaryAction: {
    text: string
    href: string
    icon?: React.ReactNode
  }
  secondaryAction?: {
    text: string
    href: string
    icon?: React.ReactNode
  }
  variant?: "default" | "sticky" | "full-width"
  className?: string
}

export function Cta({ title, description, primaryAction, secondaryAction, variant = "default", className }: CtaProps) {
  const variantStyles = {
    default: "py-10 px-6 bg-background rounded-lg border",
    sticky:
      "fixed bottom-4 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-2rem)] bg-white dark:bg-slate-900 shadow-lg px-6 py-4 z-50 rounded-lg border",
    "full-width": "py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
  }

  const buttonVariant = variant === "full-width" ? "outline" : "default"
  const secondaryVariant = variant === "full-width" ? "ghost" : "outline"
  const textColor = variant === "full-width" ? "text-white" : ""

  return (
    <div className={cn(variantStyles[variant], className)} role="region" aria-label={`${title} call to action`}>
      <div className="container mx-auto max-w-6xl">
        <h2 className={cn("text-xl md:text-2xl font-bold", textColor)}>{title}</h2>
        {description && (
          <p
            className={cn(
              "mt-2 text-sm md:text-base text-muted-foreground",
              variant === "full-width" && "text-white/80",
            )}
          >
            {description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            asChild
            variant={buttonVariant}
            className={variant === "full-width" ? "bg-white text-blue-600 hover:bg-white/90" : ""}
          >
            <Link href={primaryAction.href}>
              {primaryAction.icon}
              {primaryAction.text}
            </Link>
          </Button>
          {secondaryAction && (
            <Button
              asChild
              variant={secondaryVariant}
              className={variant === "full-width" ? "text-white hover:bg-white/10" : ""}
            >
              <Link href={secondaryAction.href}>
                {secondaryAction.icon}
                {secondaryAction.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
