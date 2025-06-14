"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

// Lazy load de Framer Motion para reducir bundle inicial
const MotionDiv = dynamic(() => import("framer-motion").then((mod) => mod.motion.div), {
  ssr: false,
  loading: () => <div className="opacity-0" />,
})

const MotionSection = dynamic(() => import("framer-motion").then((mod) => mod.motion.section), {
  ssr: false,
  loading: () => <section className="opacity-0" />,
})

const MotionH1 = dynamic(() => import("framer-motion").then((mod) => mod.motion.h1), {
  ssr: false,
  loading: () => <h1 className="opacity-0" />,
})

// Variantes de animación optimizadas
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
}

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, delay: 0.2 },
}

// Componentes optimizados
interface OptimizedMotionProps extends ComponentProps<"div"> {
  variant?: "fadeInUp" | "scaleIn"
  delay?: number
}

export function OptimizedMotionDiv({
  variant = "fadeInUp",
  delay = 0,
  children,
  className,
  ...props
}: OptimizedMotionProps) {
  const variants = {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <MotionDiv {...variants[variant]} className={className} {...props}>
      {children}
    </MotionDiv>
  )
}

export { MotionDiv, MotionSection, MotionH1 }
