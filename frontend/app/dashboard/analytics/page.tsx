"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Track and analyze your campaign performance.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,345</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.7%</div>
                <p className="text-xs text-green-600 dark:text-green-500">+5.4% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.3%</div>
                <p className="text-xs text-green-600 dark:text-green-500">+8.1% from last month</p>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Compare the performance of your campaigns over time.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                  Campaign Performance Chart
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Campaign Comparison</CardTitle>
                <CardDescription>Compare key metrics across different campaigns.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                  Campaign Comparison Chart
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Detailed analytics for each of your campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                Campaign Analytics Chart
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead Analytics</CardTitle>
              <CardDescription>Track lead sources, engagement, and conversion.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                Lead Analytics Chart
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Visualize your sales funnel from lead to customer.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                Conversion Funnel Chart
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>Understand the composition of your target audience.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
              Audience Demographics Chart
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engagement by Time</CardTitle>
            <CardDescription>Track when your audience is most responsive.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
              Engagement Time Chart
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
