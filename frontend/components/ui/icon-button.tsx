import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function IconButton({ label, icon, className, variant = "ghost", ...props }: IconButtonProps) {
  return (
    <Button variant={variant} size="icon" className={cn("h-9 w-9", className)} aria-label={label} {...props}>
      {icon}
    </Button>
  )
}
