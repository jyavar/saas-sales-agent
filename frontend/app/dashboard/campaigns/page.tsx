"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, MoreHorizontal, Plus, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { useOrchestrator, OrchestratorEvent } from "@/hooks/useOrchestrator"
import { AgentActivityFeed, AgentActivity } from "@/components/agent/AgentActivityFeed"

const campaigns = [
  {
    id: "CAM001",
    name: "Product Launch",
    status: "Active",
    leads: 450,
    responses: 213,
    rate: "47.3%",
    lastUpdated: "2 hours ago",
  },
  {
    id: "CAM002",
    name: "Feature Announcement",
    status: "Active",
    leads: 320,
    responses: 167,
    rate: "52.1%",
    lastUpdated: "5 hours ago",
  },
  {
    id: "CAM003",
    name: "Customer Feedback",
    status: "Paused",
    leads: 280,
    responses: 133,
    rate: "47.5%",
    lastUpdated: "1 day ago",
  },
  {
    id: "CAM004",
    name: "Re-engagement",
    status: "Draft",
    leads: 0,
    responses: 0,
    rate: "0%",
    lastUpdated: "3 days ago",
  },
  {
    id: "CAM005",
    name: "Competitor Analysis",
    status: "Active",
    leads: 180,
    responses: 76,
    rate: "42.2%",
    lastUpdated: "1 week ago",
  },
  {
    id: "CAM006",
    name: "Webinar Invitation",
    status: "Completed",
    leads: 520,
    responses: 312,
    rate: "60.0%",
    lastUpdated: "2 weeks ago",
  },
]

const campaignSchema = z.object({
  name: z.string().min(2),
  repoUrl: z.string().url(),
  tenantId: z.string().min(2),
})

export default function CampaignsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: "", repoUrl: "", tenantId: "" })
  const [loading, setLoading] = useState(false)
  const [agentResult, setAgentResult] = useState<any>(null)
  const { sendOrchestration } = useOrchestrator()
  const [activities, setActivities] = useState<AgentActivity[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = campaignSchema.safeParse(form)
    if (!parsed.success) {
      toast.error("Invalid input")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error")
      toast.success("Campaign created!")
      setAgentResult(data.agentResult)
      setModalOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const userId = "user_123" // Reemplazar por el user real del contexto/auth
    sendOrchestration({ userId, eventType: "CAMPAIGN_VIEWED", metadata: { page: "campaigns" } })
      .catch(() => {})
    // Carga actividades del agente
    fetch("/api/agent/activities")
      .then(res => res.json())
      .then(data => setActivities(data.activities || []))
      .catch(() => setActivities([]))
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">Manage and track your email campaigns.</p>
        </div>
        <Button className="gradient-bg" onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">6 active, 1 paused, 4 completed, 1 draft</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48.2%</div>
            <p className="text-xs text-green-600 dark:text-green-500">+5.4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>A list of all your campaigns including status and performance.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search campaigns..." className="pl-8 w-[200px] md:w-[300px]" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Paused</DropdownMenuItem>
                  <DropdownMenuItem>Completed</DropdownMenuItem>
                  <DropdownMenuItem>Draft</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Responses</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={campaign.status === "Active" ? "default" : "outline"}
                      className={campaign.status === "Active" ? "gradient-bg" : ""}
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{campaign.leads}</TableCell>
                  <TableCell className="text-right">{campaign.responses}</TableCell>
                  <TableCell className="text-right">{campaign.rate}</TableCell>
                  <TableCell className="text-right">{campaign.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
            onSubmit={handleSubmit}
          >
            <h3 className="text-lg font-bold mb-2">Create Campaign</h3>
            <input
              className="input input-bordered w-full"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="input input-bordered w-full"
              placeholder="Repo URL"
              name="repoUrl"
              value={form.repoUrl}
              onChange={handleChange}
              required
              type="url"
            />
            <input
              className="input input-bordered w-full"
              placeholder="Tenant ID"
              name="tenantId"
              value={form.tenantId}
              onChange={handleChange}
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn" onClick={() => setModalOpen(false)} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
            </div>
          </form>
        </div>
      )}

      {agentResult && (
        <div className="mt-8 p-4 border rounded bg-zinc-50 dark:bg-zinc-800">
          <h4 className="font-bold mb-2">Agent Result</h4>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(agentResult, null, 2)}</pre>
        </div>
      )}

      <div className="mt-8">
        <h4 className="font-bold mb-2">Agent Activity Feed</h4>
        <AgentActivityFeed activities={activities} />
      </div>
    </motion.div>
  )
}
