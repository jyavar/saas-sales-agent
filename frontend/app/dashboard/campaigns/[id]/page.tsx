"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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

// Mock data
const mockCampaign: Campaign = {
  id: "camp-1234",
  name: "Product Launch - MVP Announcement",
  status: "Running",
  metrics: {
    sent: 1250,
    openRate: 42.8,
    clickRate: 12.3,
    replyRate: 8.5,
    conversionRate: 3.2,
    lastSent: "2023-07-15T14:30:00Z",
  },
  audience: {
    total: 2500,
    domains: [
      { name: "gmail.com", value: 35 },
      { name: "outlook.com", value: 25 },
      { name: "company.com", value: 40 },
    ],
    industries: [
      { name: "Technology", value: 45 },
      { name: "Finance", value: 25 },
      { name: "Healthcare", value: 30 },
    ],
    positions: [
      { name: "CTO", value: 30 },
      { name: "Developer", value: 40 },
      { name: "Product Manager", value: 30 },
    ],
    locations: [
      { name: "United States", value: 55 },
      { name: "Europe", value: 30 },
      { name: "Asia", value: 15 },
    ],
  },
  emails: [
    {
      id: "e1",
      leadName: "John Smith",
      email: "john@example.com",
      company: "TechCorp",
      position: "CTO",
      opened: true,
      replied: true,
      clicked: true,
      converted: true,
      sentAt: "2023-07-15T14:30:00Z",
      openedAt: "2023-07-15T14:45:00Z",
      clickedAt: "2023-07-15T14:50:00Z",
      repliedAt: "2023-07-15T16:30:00Z",
      convertedAt: "2023-07-16T10:15:00Z",
      followUps: 0,
    },
    {
      id: "e2",
      leadName: "Sarah Johnson",
      email: "sarah@company.com",
      company: "InnovateCo",
      position: "Product Manager",
      opened: true,
      replied: false,
      clicked: true,
      converted: false,
      sentAt: "2023-07-15T14:25:00Z",
      openedAt: "2023-07-15T15:10:00Z",
      clickedAt: "2023-07-15T15:12:00Z",
      followUps: 1,
    },
    {
      id: "e3",
      leadName: "Michael Brown",
      email: "michael@startup.io",
      company: "StartupIO",
      position: "CEO",
      opened: true,
      replied: true,
      clicked: false,
      converted: false,
      sentAt: "2023-07-15T14:20:00Z",
      openedAt: "2023-07-15T14:40:00Z",
      repliedAt: "2023-07-15T17:25:00Z",
      followUps: 0,
    },
    {
      id: "e4",
      leadName: "Emily Davis",
      email: "emily@tech.co",
      company: "TechCo",
      position: "Developer",
      opened: false,
      replied: false,
      clicked: false,
      converted: false,
      sentAt: "2023-07-15T14:15:00Z",
      followUps: 2,
    },
    {
      id: "e5",
      leadName: "David Wilson",
      email: "david@example.org",
      company: "ExampleOrg",
      position: "CTO",
      opened: true,
      replied: false,
      clicked: false,
      converted: false,
      sentAt: "2023-07-15T14:10:00Z",
      openedAt: "2023-07-15T14:30:00Z",
      followUps: 1,
    },
    {
      id: "e6",
      leadName: "Jessica Lee",
      email: "jessica@company.net",
      company: "NetCompany",
      position: "Product Manager",
      opened: true,
      replied: true,
      clicked: true,
      converted: true,
      sentAt: "2023-07-15T14:05:00Z",
      openedAt: "2023-07-15T14:20:00Z",
      clickedAt: "2023-07-15T14:25:00Z",
      repliedAt: "2023-07-15T16:10:00Z",
      convertedAt: "2023-07-16T09:30:00Z",
      followUps: 0,
    },
    {
      id: "e7",
      leadName: "Robert Taylor",
      email: "robert@startup.com",
      company: "StartupCom",
      position: "Developer",
      opened: true,
      replied: false,
      clicked: true,
      converted: false,
      sentAt: "2023-07-15T14:00:00Z",
      openedAt: "2023-07-15T14:15:00Z",
      clickedAt: "2023-07-15T14:20:00Z",
      followUps: 1,
    },
    {
      id: "e8",
      leadName: "Amanda Martinez",
      email: "amanda@tech.io",
      company: "TechIO",
      position: "CTO",
      opened: false,
      replied: false,
      clicked: false,
      converted: false,
      sentAt: "2023-07-15T13:55:00Z",
      followUps: 2,
    },
    {
      id: "e9",
      leadName: "James Anderson",
      email: "james@example.com",
      company: "ExampleCom",
      position: "Developer",
      opened: true,
      replied: false,
      clicked: false,
      converted: false,
      sentAt: "2023-07-15T13:50:00Z",
      openedAt: "2023-07-15T14:05:00Z",
      followUps: 1,
    },
    {
      id: "e10",
      leadName: "Lisa Thomas",
      email: "lisa@company.org",
      company: "OrgCompany",
      position: "Product Manager",
      opened: true,
      replied: true,
      clicked: true,
      converted: false,
      sentAt: "2023-07-15T13:45:00Z",
      openedAt: "2023-07-15T14:00:00Z",
      clickedAt: "2023-07-15T14:05:00Z",
      repliedAt: "2023-07-15T15:45:00Z",
      followUps: 0,
    },
  ],
  timeline: [
    {
      id: "t1",
      title: "Campaign Created",
      description: "Campaign was set up with initial parameters",
      date: "2023-07-01T10:00:00Z",
      icon: "calendar",
    },
    {
      id: "t2",
      title: "First Email Sent",
      description: "Campaign started sending emails to the first batch of recipients",
      date: "2023-07-05T09:30:00Z",
      icon: "mail",
    },
    {
      id: "t3",
      title: "First Reply",
      description: "Received first positive response from John Smith at TechCorp",
      date: "2023-07-05T14:45:00Z",
      icon: "reply",
    },
    {
      id: "t4",
      title: "First Conversion",
      description: "John Smith scheduled a demo call",
      date: "2023-07-08T11:20:00Z",
      icon: "check",
    },
    {
      id: "t5",
      title: "Follow-up Sequence Started",
      description: "Automated follow-ups began for non-responders",
      date: "2023-07-12T09:00:00Z",
      icon: "mail",
    },
  ],
  technical: {
    sendingEmail: "sales@stratoai.com",
    deliveryMethod: "API",
    leadSource: "GitHub",
    personalization: true,
    sendingSchedule: "Weekdays, 9 AM - 4 PM recipient local time",
    startDate: "2023-07-05T09:00:00Z",
    endDate: null,
    emailTemplate: "Product Launch - Initial",
    followUpTemplate: "Product Launch - Follow Up",
    maxFollowUps: 3,
  },
  performance: {
    dailyStats: [
      { date: "2023-07-05", sent: 250, opened: 110, clicked: 35, replied: 20, converted: 5 },
      { date: "2023-07-06", sent: 250, opened: 105, clicked: 30, replied: 22, converted: 8 },
      { date: "2023-07-07", sent: 250, opened: 115, clicked: 32, replied: 18, converted: 7 },
      { date: "2023-07-10", sent: 250, opened: 100, clicked: 28, replied: 25, converted: 10 },
      { date: "2023-07-11", sent: 250, opened: 108, clicked: 30, replied: 21, converted: 10 },
    ],
    topPerformingSubject: "Revolutionize your workflow with our new product",
    topPerformingTime: "Tuesday, 10 AM - 12 PM",
    engagementByDevice: [
      { name: "Desktop", value: 65 },
      { name: "Mobile", value: 30 },
      { name: "Tablet", value: 5 },
    ],
    engagementByLocation: [
      { name: "United States", value: 55 },
      { name: "Europe", value: 30 },
      { name: "Asia", value: 15 },
    ],
  },
}

// Helper function to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

// Helper function to get status badge variant
function getStatusVariant(status: string): string {
  switch (status) {
    case "Running":
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
    case "Paused":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
    case "Draft":
      return "bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400"
    case "Completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
    case "Error":
      return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
    default:
      return ""
  }
}

// Helper function to get icon for timeline
function getTimelineIcon(iconName: string) {
  switch (iconName) {
    case "calendar":
      return <Calendar className="h-5 w-5" />
    case "mail":
      return <Mail className="h-5 w-5" />
    case "reply":
      return <ArrowLeft className="h-5 w-5 rotate-180" />
    case "check":
      return <CheckCircle className="h-5 w-5" />
    default:
      return <Calendar className="h-5 w-5" />
  }
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("performance")
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)

  // Simulate API call to fetch campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      // In a real app, you would fetch the campaign data from an API
      // For now, we'll use the mock data
      setTimeout(() => {
        setCampaign(mockCampaign)
        setLoading(false)
      }, 1000)
    }

    fetchCampaign()
  }, [params.id])

  const toggleEmailDetails = (emailId: string) => {
    if (expandedEmail === emailId) {
      setExpandedEmail(null)
    } else {
      setExpandedEmail(emailId)
    }
  }

  if (loading) {
    return <CampaignDetailSkeleton />
  }

  if (!campaign) {
    return <CampaignNotFound />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* Breadcrumb */}
      <Button
        variant="ghost"
        className="pl-0 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        onClick={() => router.push("/dashboard/campaigns")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Campaigns
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">📊 Campaign Overview</h1>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{campaign.name}</h2>
            <Badge variant="outline" className={getStatusVariant(campaign.status)}>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created on {formatDate(campaign.timeline[0].date)} • ID: {campaign.id}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <MoreHorizontal className="h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Play className="mr-2 h-4 w-4" />
                <span>Resume Campaign</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pause className="mr-2 h-4 w-4" />
                <span>Pause Campaign</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Campaign</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicate Campaign</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Campaign</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="gap-1">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button className="gap-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white">
            <BarChart3 className="h-4 w-4" /> View Report
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Mail className="h-5 w-5 text-slate-500 mb-2" />
            <p className="text-sm text-slate-500">Emails Sent</p>
            <p className="text-2xl font-semibold">{campaign.metrics.sent.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-5 w-5 text-slate-500 mb-2" />
            <p className="text-sm text-slate-500">Open Rate</p>
            <p className="text-2xl font-semibold">{campaign.metrics.openRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-5 w-5 text-slate-500 mb-2" />
            <p className="text-sm text-slate-500">Click Rate</p>
            <p className="text-2xl font-semibold">{campaign.metrics.clickRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-5 w-5 text-slate-500 mb-2" />
            <p className="text-sm text-slate-500">Reply Rate</p>
            <p className="text-2xl font-semibold">{campaign.metrics.replyRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <BarChart3 className="h-5 w-5 text-slate-500 mb-2" />
            <p className="text-sm text-slate-500">Conversion Rate</p>
            <p className="text-2xl font-semibold">{campaign.metrics.conversionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Clock className="h-5 w-5 text-slate-500 mb-2" />
            <p className="text-sm text-slate-500">Last Sent</p>
            <p className="text-sm font-semibold">{formatDate(campaign.metrics.lastSent)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h3 className="font-medium">Campaign Progress</h3>
              <p className="text-sm text-muted-foreground">
                {campaign.metrics.sent} of {campaign.audience.total} emails sent (
                {Math.round((campaign.metrics.sent / campaign.audience.total) * 100)}%)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                Active
              </Badge>
              <p className="text-sm text-muted-foreground">
                {campaign.technical.endDate ? `Ends on ${formatDate(campaign.technical.endDate)}` : "No end date set"}
              </p>
            </div>
          </div>
          <Progress value={(campaign.metrics.sent / campaign.audience.total) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-8">
          {/* Performance Charts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <p className="text-slate-500">Chart Placeholder: Daily Performance Metrics</p>
              </div>
              <div className="grid grid-cols-5 gap-4 mt-6">
                {campaign.performance.dailyStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-sm font-medium">{stat.date.split("-")[2]}</p>
                    <p className="text-xs text-muted-foreground">{stat.date.split("-")[1]}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Sent:</span>
                        <span className="font-medium">{stat.sent}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Opened:</span>
                        <span className="font-medium">{stat.opened}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Clicked:</span>
                        <span className="font-medium">{stat.clicked}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Replied:</span>
                        <span className="font-medium">{stat.replied}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Converted:</span>
                        <span className="font-medium">{stat.converted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Email Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]"></TableHead>
                      <TableHead>Lead Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Opened</TableHead>
                      <TableHead className="text-center">Replied</TableHead>
                      <TableHead className="text-center">Clicked</TableHead>
                      <TableHead className="text-center">Converted</TableHead>
                      <TableHead className="text-right">Date Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaign.emails.map((email) => (
                      <React.Fragment key={email.id}>
                        <TableRow className="cursor-pointer" onClick={() => toggleEmailDetails(email.id)}>
                          <TableCell>
                            {expandedEmail === email.id ? (
                              <ChevronUp className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{email.leadName}</TableCell>
                          <TableCell>{email.email}</TableCell>
                          <TableCell className="text-center">
                            {email.opened ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {email.replied ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {email.clicked ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {email.converted ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">{formatDate(email.sentAt)}</TableCell>
                        </TableRow>
                        {expandedEmail === email.id && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-slate-50 dark:bg-slate-900/50 p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Lead Details</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <Building className="h-4 w-4 text-slate-500 mt-0.5" />
                                      <div>
                                        <p className="font-medium">Company</p>
                                        <p className="text-sm text-slate-500">{email.company}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Briefcase className="h-4 w-4 text-slate-500 mt-0.5" />
                                      <div>
                                        <p className="font-medium">Position</p>
                                        <p className="text-sm text-slate-500">{email.position}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Mail className="h-4 w-4 text-slate-500 mt-0.5" />
                                      <div>
                                        <p className="font-medium">Follow-ups</p>
                                        <p className="text-sm text-slate-500">
                                          {email.followUps} of {campaign.technical.maxFollowUps}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Engagement Timeline</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                      </div>
                                      <p className="text-sm">
                                        <span className="font-medium">Sent</span> on {formatDate(email.sentAt)}
                                      </p>
                                    </div>
                                    {email.openedAt && (
                                      <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                          <Eye className="h-3 w-3 text-green-600 dark:text-green-400" />
                                        </div>
                                        <p className="text-sm">
                                          <span className="font-medium">Opened</span> on {formatDate(email.openedAt)}
                                        </p>
                                      </div>
                                    )}
                                    {email.clickedAt && (
                                      <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                          <MousePointer className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <p className="text-sm">
                                          <span className="font-medium">Clicked</span> on {formatDate(email.clickedAt)}
                                        </p>
                                      </div>
                                    )}
                                    {email.repliedAt && (
                                      <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                          <ArrowLeft className="h-3 w-3 text-indigo-600 dark:text-indigo-400 rotate-180" />
                                        </div>
                                        <p className="text-sm">
                                          <span className="font-medium">Replied</span> on {formatDate(email.repliedAt)}
                                        </p>
                                      </div>
                                    )}
                                    {email.convertedAt && (
                                      <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                          <Star className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <p className="text-sm">
                                          <span className="font-medium">Converted</span> on{" "}
                                          {formatDate(email.convertedAt)}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  <Mail className="mr-2 h-3 w-3" />
                                  Send Follow-up
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="mr-2 h-3 w-3" />
                                  View Email
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Top Performing Subject Line</p>
                      <p className="text-slate-500">{campaign.performance.topPerformingSubject}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Best Sending Time</p>
                      <p className="text-slate-500">{campaign.performance.topPerformingTime}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Device Engagement</p>
                      <div className="mt-2 space-y-2">
                        {campaign.performance.engagementByDevice.map((device, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-full max-w-[180px]">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs">{device.name}</span>
                                <span className="text-xs font-medium">{device.value}%</span>
                              </div>
                              <Progress value={device.value} className="h-1.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audience Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-500 mb-4">Domains</h3>
                  <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500">Chart Placeholder: Domain Distribution</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {campaign.audience.domains.map((domain, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{domain.name}</span>
                            <span className="text-sm font-medium">{domain.value}%</span>
                          </div>
                          <Progress value={domain.value} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-500 mb-4">Industries</h3>
                  <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <p className="text-slate-500">Chart Placeholder: Industry Distribution</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {campaign.audience.industries.map((industry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{industry.name}</span>
                            <span className="text-sm font-medium">{industry.value}%</span>
                          </div>
                          <Progress value={industry.value} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-4">Positions</h3>
                  <div className="space-y-2">
                    {campaign.audience.positions.map((position, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{position.name}</span>
                            <span className="text-sm font-medium">{position.value}%</span>
                          </div>
                          <Progress value={position.value} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-4">Locations</h3>
                  <div className="space-y-2">
                    {campaign.audience.locations.map((location, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{location.name}</span>
                            <span className="text-sm font-medium">{location.value}%</span>
                          </div>
                          <Progress value={location.value} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-8">
                {/* Vertical line */}
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700"></div>

                {campaign.timeline.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Circle */}
                    <div className="absolute -left-8 mt-1.5 h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getTimelineIcon(event.icon)}
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">{formatDate(event.date)}</p>
                      <h3 className="font-medium mt-1">{event.title}</h3>
                      {event.description && (
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Sending Email</p>
                      <p className="text-slate-500">{campaign.technical.sendingEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Server className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Delivery Method</p>
                      <p className="text-slate-500">{campaign.technical.deliveryMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <GitBranch className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Lead Source</p>
                      <p className="text-slate-500">{campaign.technical.leadSource}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Personalization</p>
                      <p className="text-slate-500">{campaign.technical.personalization ? "Enabled" : "Disabled"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Sending Schedule</p>
                      <p className="text-slate-500">{campaign.technical.sendingSchedule}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Campaign Dates</p>
                      <p className="text-slate-500">
                        Started: {formatDate(campaign.technical.startDate)}
                        <br />
                        {campaign.technical.endDate
                          ? `Ends: ${formatDate(campaign.technical.endDate)}`
                          : "No end date set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Templates</p>
                      <p className="text-slate-500">
                        Initial: {campaign.technical.emailTemplate}
                        <br />
                        Follow-up: {campaign.technical.followUpTemplate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium">Follow-ups</p>
                      <p className="text-slate-500">Maximum {campaign.technical.maxFollowUps} follow-ups per lead</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

// Loading skeleton
function CampaignDetailSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Skeleton className="h-8 w-32" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <Skeleton className="h-5 w-5 mb-2" />
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

// Not found component
function CampaignNotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
        <AlertCircle className="h-12 w-12 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
      <p className="text-slate-500 mb-6 max-w-md">
        The campaign you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Button onClick={() => router.push("/dashboard/campaigns")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Campaigns
      </Button>
    </div>
  )
}
