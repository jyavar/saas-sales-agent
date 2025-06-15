"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export interface Lead {
  id: string
  name: string
  email: string
  company: string
  position: string
  source: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  score: number
  lastActivity: string
  createdAt: string
}

export function useLeads() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getLeads = async (): Promise<Lead[]> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/leads")
      if (!res.ok) throw new Error("Failed to fetch leads")
      const data = await res.json()
      return data.leads || []
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads")
      return []
    } finally {
      setLoading(false)
    }
  }

  const getLeadById = async (id: string): Promise<Lead | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/leads/${id}`)
      if (!res.ok) throw new Error("Failed to fetch lead")
      const data = await res.json()
      return data.lead || null
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch lead")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createLead = async (leadData: Partial<Lead>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      })
      if (!res.ok) throw new Error("Failed to create lead")
      const data = await res.json()
      router.refresh()
      return data.lead
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    setLoading(true)
    setError(null)

    try {
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // En producción, aquí iría la llamada real a la API
      // const response = await fetch(`/api/leads/${id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(leadData),
      // })

      // if (!response.ok) throw new Error("Failed to update lead")

      router.refresh()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead")
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteLead = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En producción, aquí iría la llamada real a la API
      // const response = await fetch(`/api/leads/${id}`, {
      //   method: "DELETE",
      // })

      // if (!response.ok) throw new Error("Failed to delete lead")

      router.refresh()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lead")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    loading,
    error,
  }
}
