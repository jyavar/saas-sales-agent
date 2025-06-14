import type React from "react"
import Link, { type LinkProps } from "next/link"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface SeoLinkProps extends LinkProps {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
  testId?: string
  external?: boolean
}

export const SeoLink = forwardRef<HTMLAnchorElement, SeoLinkProps>(
  ({ children, className, ariaLabel, testId, external = false, ...props }, ref) => {
    const externalProps = external
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {}

    return (
      <Link
        className={cn("focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", className)}
        aria-label={ariaLabel}
        data-testid={testId}
        ref={ref}
        {...externalProps}
        {...props}
      >
        {children}
      </Link>
    )
  },
)

SeoLink.displayName = "SeoLink"
