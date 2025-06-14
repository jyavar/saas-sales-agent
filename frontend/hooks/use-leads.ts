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
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      return [
        {
          id: "1",
          name: "John Smith",
          email: "john@example.com",
          company: "Acme Inc",
          position: "CTO",
          source: "GitHub",
          status: "new",
          score: 85,
          lastActivity: "2023-06-10T14:30:00Z",
          createdAt: "2023-06-01T10:30:00Z",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          company: "TechCorp",
          position: "Engineering Manager",
          source: "Website",
          status: "contacted",
          score: 72,
          lastActivity: "2023-06-12T09:15:00Z",
          createdAt: "2023-05-20T15:45:00Z",
        },
        {
          id: "3",
          name: "Michael Brown",
          email: "michael@example.com",
          company: "DevSolutions",
          position: "Lead Developer",
          source: "GitHub",
          status: "qualified",
          score: 91,
          lastActivity: "2023-06-14T11:20:00Z",
          createdAt: "2023-05-15T08:30:00Z",
        },
        {
          id: "4",
          name: "Emily Davis",
          email: "emily@example.com",
          company: "InnovateTech",
          position: "Product Manager",
          source: "Referral",
          status: "converted",
          score: 95,
          lastActivity: "2023-06-08T16:45:00Z",
          createdAt: "2023-04-28T13:15:00Z",
        },
      ] as Lead[]
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
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock data
      const leads = await getLeads()
      return leads.find((lead) => lead.id === id) || null
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
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // En producción, aquí iría la llamada real a la API
      // const response = await fetch("/api/leads", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(leadData),
      // })

      // if (!response.ok) throw new Error("Failed to create lead")
      // const data = await response.json()

      router.refresh()
      return { id: "new-lead-id" }
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
