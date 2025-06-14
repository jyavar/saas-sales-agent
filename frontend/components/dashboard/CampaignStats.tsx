"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

interface CampaignStatsProps {
  title: string
  value: string
  description?: string
  trend?: {
    value: string
    positive: boolean
  }
}

export default function CampaignStats({ title, value, description, trend }: CampaignStatsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <p
            className={`text-xs flex items-center mt-1 ${
              trend.positive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
            }`}
          >
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
