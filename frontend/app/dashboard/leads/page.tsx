"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

const leads = [
  {
    id: "LEAD001",
    name: "Alex Johnson",
    email: "alex@techflow.com",
    company: "TechFlow",
    status: "New",
    source: "GitHub",
    lastActivity: "2 hours ago",
  },
  {
    id: "LEAD002",
    name: "Sarah Williams",
    email: "sarah@datasync.io",
    company: "DataSync",
    status: "Contacted",
    source: "LinkedIn",
    lastActivity: "5 hours ago",
  },
  {
    id: "LEAD003",
    name: "Michael Chen",
    email: "michael@cloudstack.dev",
    company: "CloudStack",
    status: "Meeting Scheduled",
    source: "GitHub",
    lastActivity: "1 day ago",
  },
  {
    id: "LEAD004",
    name: "Jessica Lee",
    email: "jessica@devops.io",
    company: "DevOps Inc",
    status: "New",
    source: "Website",
    lastActivity: "3 days ago",
  },
  {
    id: "LEAD005",
    name: "David Wilson",
    email: "david@aiplatform.com",
    company: "AI Platform",
    status: "Qualified",
    source: "GitHub",
    lastActivity: "1 week ago",
  },
  {
    id: "LEAD006",
    name: "Emily Brown",
    email: "emily@dataflow.io",
    company: "DataFlow",
    status: "Disqualified",
    source: "LinkedIn",
    lastActivity: "2 weeks ago",
  },
]

export default function LeadsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">Manage and track your leads from all sources.</p>
        </div>
        <Button className="gradient-bg">
          <Plus className="mr-2 h-4 w-4" />
          Import Leads
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+180 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-green-600 dark:text-green-500">+32 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-green-600 dark:text-green-500">+65 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19.1%</div>
            <p className="text-xs text-green-600 dark:text-green-500">+2.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>A list of all your leads including status and source.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search leads..." className="pl-8 w-[200px] md:w-[300px]" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>New</DropdownMenuItem>
                  <DropdownMenuItem>Contacted</DropdownMenuItem>
                  <DropdownMenuItem>Meeting Scheduled</DropdownMenuItem>
                  <DropdownMenuItem>Qualified</DropdownMenuItem>
                  <DropdownMenuItem>Disqualified</DropdownMenuItem>
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
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <Badge
                      variant={lead.status === "New" ? "default" : "outline"}
                      className={lead.status === "New" ? "gradient-bg" : ""}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.lastActivity}</TableCell>
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
                        <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                        <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
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
    </motion.div>
  )
}
