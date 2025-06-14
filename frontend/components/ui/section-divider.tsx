"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionDividerProps {
  className?: string
  variant?: "wave" | "curve" | "angle" | "triangle"
  flip?: boolean
  color?: string
}

export function SectionDivider({
  className,
  variant = "wave",
  flip = false,
  color = "fill-background"
}: SectionDividerProps) {
  const variants = {
    wave: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        className={cn("w-full", className)}
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ opacity: 0, pathLength: 0 }}
          whileInView={{ opacity: 1, pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeInOut" }}
          d={
            flip
              ? "M0,0L40,10.7C80,21,160,43,240,53.3C320,64,400,64,480,58.7C560,53,640,43,720,48C800,53,880,75,960,80C1040,85,1120,75,1200,58.7C1280,43,1360,21,1400,10.7L1440,0L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
              : "M0,120L40,109.3C80,99,160,77,240,66.7C320,56,400,56,480,61.3C560,67,640,77,720,72C800,67,880,45,960,40C1040,35,1120,45,1200,61.3C1280,77,1360,99,1400,109.3L1440,120L1440,120L1400,120C1360,120,1280,120,1200,120C1120,120,1040,120,960,120C880,120,800,120,720,120C640,120,560,120,480,120C400,120,320,120,240,120C160,120,80,120,40,120L0,120Z"
          }
          className={color}
        />
      </svg>
    ),
    curve: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        className={cn("w-full", className)}
        preserveAspectRatio="none"
      >
        <motion.path
          initial={{ opacity
