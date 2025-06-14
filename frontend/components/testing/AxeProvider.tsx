"use client"

import React from "react"

import { useEffect } from "react"
import ReactDOM from "react-dom/client"

export function AxeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@axe-core/react").then((axe) => {
        axe.default(React, ReactDOM, 1000)
      })
    }
  }, [])

  return <>{children}</>
}
