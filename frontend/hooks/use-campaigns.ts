"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export interface Campaign {
  id: string
  name: string
  status: "draft" | "active" | "paused" | "completed"
  sentCount: number
  openRate: number
  clickRate: number
  responseRate: number
  createdAt: string
}

export function useCampaigns() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getCampaigns = async (): Promise<Campaign[]> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/campaigns")
      if (!res.ok) throw new Error("Failed to fetch campaigns")
      const data = await res.json()
      return data.campaigns || []
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaigns")
      return []
    } finally {
      setLoading(false)
    }
  }

  const getCampaignById = async (id: string): Promise<Campaign | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/campaigns/${id}`)
      if (!res.ok) throw new Error("Failed to fetch campaign")
      const data = await res.json()
      return data.campaign || null
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaign")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      })
      if (!res.ok) throw new Error("Failed to create campaign")
      const data = await res.json()
      router.refresh()
      return data.campaign
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign")
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateCampaign = async (id: string, campaignData: Partial<Campaign>) => {
    setLoading(true)
    setError(null)

    try {
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // En producción, aquí iría la llamada real a la API
      // const response = await fetch(`/api/campaigns/${id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(campaignData),
      // })

      // if (!response.ok) throw new Error("Failed to update campaign")

      router.refresh()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update campaign")
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteCampaign = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En producción, aquí iría la llamada real a la API
      // const response = await fetch(`/api/campaigns/${id}`, {
      //   method: "DELETE",
      // })

      // if (!response.ok) throw new Error("Failed to delete campaign")

      router.refresh()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete campaign")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    getCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    loading,
    error,
  }
}
