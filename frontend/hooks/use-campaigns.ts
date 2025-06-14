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
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      return [
        {
          id: "1",
          name: "Product Launch",
          status: "active",
          sentCount: 1250,
          openRate: 42.3,
          clickRate: 12.8,
          responseRate: 8.5,
          createdAt: "2023-05-15T10:30:00Z",
        },
        {
          id: "2",
          name: "Feature Announcement",
          status: "draft",
          sentCount: 0,
          openRate: 0,
          clickRate: 0,
          responseRate: 0,
          createdAt: "2023-06-01T14:45:00Z",
        },
        {
          id: "3",
          name: "Follow-up Sequence",
          status: "paused",
          sentCount: 875,
          openRate: 38.7,
          clickRate: 9.2,
          responseRate: 5.1,
          createdAt: "2023-04-22T09:15:00Z",
        },
        {
          id: "4",
          name: "Customer Feedback",
          status: "completed",
          sentCount: 2100,
          openRate: 45.2,
          clickRate: 15.3,
          responseRate: 10.8,
          createdAt: "2023-03-10T11:20:00Z",
        },
      ] as Campaign[]
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
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock data
      const campaigns = await getCampaigns()
      return campaigns.find((campaign) => campaign.id === id) || null
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
      // Simulación de API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // En producción, aquí iría la llamada real a la API
      // const response = await fetch("/api/campaigns", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(campaignData),
      // })

      // if (!response.ok) throw new Error("Failed to create campaign")
      // const data = await response.json()

      router.refresh()
      return { id: "new-campaign-id" }
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
