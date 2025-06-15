"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ApiClient } from "../../../../backend/frontend/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Pause,
  Edit,
  Copy,
  BarChart3,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Server,
  GitBranch,
  Settings,
  Users,
  Building,
  Briefcase,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  MoreHorizontal,
  Play,
  Trash2,
  Smartphone,
  MousePointer,
  Star,
  Eye,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

// Types
interface Campaign {
  id: string
  name: string
  status: "Draft" | "Running" | "Completed" | "Paused" | "Error"
  metrics: {
    sent: number
    openRate: number
    clickRate: number
    replyRate: number
    conversionRate: number
    lastSent: string
  }
  audience: {
    total: number
    domains: { name: string; value: number }[]
    industries: { name: string; value: number }[]
    positions: { name: string; value: number }[]
    locations: { name: string; value: number }[]
  }
  emails: Email[]
  timeline: TimelineEvent[]
  technical: {
    sendingEmail: string
    deliveryMethod: "SMTP" | "API"
    leadSource: "GitHub" | "CSV" | "Scraped"
    personalization: boolean
    sendingSchedule: string
    startDate: string
    endDate: string | null
    emailTemplate: string
    followUpTemplate: string
    maxFollowUps: number
  }
  performance: {
    dailyStats: DailyStat[]
    topPerformingSubject: string
    topPerformingTime: string
    engagementByDevice: { name: string; value: number }[]
    engagementByLocation: { name: string; value: number }[]
  }
}

interface Email {
  id: string
  leadName: string
  email: string
  company: string
  position: string
  opened: boolean
  replied: boolean
  clicked: boolean
  converted: boolean
  sentAt: string
  openedAt?: string
  clickedAt?: string
  repliedAt?: string
  convertedAt?: string
  followUps: number
}

interface TimelineEvent {
  id: string
  title: string
  description?: string
  date: string
  icon: string
}

interface DailyStat {
  date: string
  sent: number
  opened: number
  clicked: number
  replied: number
  converted: number
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true)
      setError(null)
      try {
        const api = new ApiClient()
        const res = await api.get(`/api/campaigns/${params.id}`)
        if (!res.success) throw new Error(res.error?.message || "API error")
        setCampaign(res.data)
      } catch (err: any) {
        setError(err.message || "Error fetching campaign")
      } finally {
        setLoading(false)
      }
    }
    fetchCampaign()
  }, [params.id])

  if (loading) return <div className="p-4 text-gray-500">Loading campaign...</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>
  if (!campaign) return <div className="p-4 text-gray-500">Campaign not found.</div>

  // Renderiza el dashboard real usando los datos de la campaña
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
        <h2 className="text-2xl font-bold">{campaign.name}</h2>
        <Badge>{campaign.status}</Badge>
      </div>
      {/* Aquí renderiza el resto del dashboard usando campaign */}
      <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(campaign, null, 2)}</pre>
    </div>
  )
}
