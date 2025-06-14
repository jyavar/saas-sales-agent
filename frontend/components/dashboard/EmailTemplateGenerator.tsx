"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Wand2, RefreshCw, Copy, Download } from "lucide-react"
import { useState } from "react"

export default function EmailTemplateGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTemplate, setGeneratedTemplate] =
    useState(`Subject: Streamline Your Project Management with Our Solution

Hi {{name}},

I noticed that {{company}} has been growing rapidly, and with growth often comes challenges in project management and team coordination.

Our solution helps tech startups like yours save an average of 15 hours per week on project management tasks by:
- Automating routine status updates
- Centralizing communication
- Providing real-time visibility into project progress

Would you be open to a quick 15-minute call this week to see if our solution could be a good fit for {{company}}?

Best regards,
[Your Name]
[Your Title]
`)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTemplate)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Templates</CardTitle>
        <CardDescription>Generate and customize email templates with AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Type</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400"
              >
                Cold Outreach
              </Button>
              <Button variant="outline">Follow-up</Button>
              <Button variant="outline">Demo Request</Button>
              <Button variant="outline">Feature Announcement</Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Target Audience</label>
            <Input placeholder="e.g., Tech startups, Project managers, etc." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Key Value Proposition</label>
            <Input placeholder="e.g., Save time, Increase revenue, etc." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tone</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400"
              >
                Professional
              </Button>
              <Button variant="outline">Friendly</Button>
              <Button variant="outline">Direct</Button>
              <Button variant="outline">Persuasive</Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Template"}
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Generated Template</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="text-xs">Regenerate</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={handleCopy}>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-xs">Copy</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="text-xs">Save</span>
              </Button>
            </div>
          </div>
          <Textarea rows={10} className="font-mono text-sm" value={generatedTemplate} />
        </div>
      </CardContent>
    </Card>
  )
}
