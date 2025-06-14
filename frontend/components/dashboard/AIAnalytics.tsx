"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Users, MessageSquare, FileText, Wand2 } from "lucide-react"

export default function AIAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>AI-powered analysis of your campaigns and leads</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Campaign Performance Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Your "Product Launch" campaign is outperforming others with a 8.2% conversion rate, which is 3.4% higher
                than your average. The personalized subject lines and targeted audience segmentation are likely
                contributing factors. Consider applying similar strategies to your other campaigns.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-medium">Lead Quality Insights</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Leads from GitHub repositories have a 2.3x higher conversion rate than other sources. These leads are
                more technically qualified and show higher engagement with your product documentation. Consider
                allocating more resources to GitHub-based lead generation.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium">Email Content Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Emails with specific pain points in the first paragraph have a 35% higher open rate. Additionally,
                emails sent on Tuesday and Thursday mornings (9-11 AM) have the highest engagement. Your most effective
                call-to-action is "Schedule a quick demo" which outperforms others by 28%.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Recommended Actions</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-300 mt-1 space-y-1 list-disc list-inside">
                <li>Increase GitHub-based lead generation by 25%</li>
                <li>Optimize email sending times to Tuesday/Thursday mornings</li>
                <li>Apply personalization strategies from "Product Launch" to other campaigns</li>
                <li>Focus on specific pain points in email openings</li>
                <li>Use "Schedule a quick demo" as your primary call-to-action</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Detailed Report
        </Button>
      </CardFooter>
    </Card>
  )
}
