"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  ImageIcon,
  Plus,
  Search,
  Save,
  Eye,
  MoreHorizontal,
  Trash2,
  Copy,
  ArrowLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [activeTemplate, setActiveTemplate] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editorContent, setEditorContent] = useState("")
  const [activeTab, setActiveTab] = useState("edit")
  const [templateName, setTemplateName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetch("/api/templates")
      .then(res => res.json())
      .then(data => {
        setTemplates(data.templates || [])
        setActiveTemplate(data.templates?.[0] || null)
        setTemplateName(data.templates?.[0]?.name || "")
        setEditorContent(data.templates?.[0]?.content || "")
      })
  }, [])

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle save action
  const handleSave = () => {
    setIsSaving(true)
    // TODO: Implement API call to save template
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Email Templates</h2>
          <p className="text-muted-foreground">Create and manage your email templates.</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Template Sidebar */}
        <Card className="lg:col-span-3">
          <CardHeader className="p-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="px-4 pb-4 space-y-2">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      activeTemplate?.id === template.id
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                    onClick={() => setActiveTemplate(template)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{template.name}</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-2">
                        {template.category}
                      </Badge>
                      <span>{template.lastEdited}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Template Editor */}
        <Card className="lg:col-span-9">
          <CardHeader className="p-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="h-9 text-lg font-medium border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <motion.div
                        className="h-4 w-4 mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <svg
                          className="animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="h-12 px-4 w-full justify-start bg-transparent border-b-0">
                  <TabsTrigger
                    value="edit"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Edit
                  </TabsTrigger>
                  <TabsTrigger
                    value="variables"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Variables
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="p-0 m-0">
                <div className="p-4 border-b bg-slate-50 dark:bg-slate-900">
                  <div className="flex flex-wrap gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="mx-1 h-8" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="mx-1 h-8" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="mx-1 h-8" />
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="border rounded-md p-4 min-h-[400px] bg-white dark:bg-slate-950">
                    <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="variables" className="p-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Template Variables</CardTitle>
                    <CardDescription>
                      These variables will be replaced with actual values when the email is sent.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="font-medium">Recipient Variables</div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                            <code>{"{{first_name}}"}</code>
                            <Badge variant="outline">Required</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                            <code>{"{{company}}"}</code>
                            <Badge variant="outline">Required</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                            <code>{"{{industry}}"}</code>
                            <Badge variant="outline">Optional</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                            <code>{"{{pain_point}}"}</code>
                            <Badge variant="outline">Optional</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium">Sender Variables</div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                            <code>{"{{sender_name}}"}</code>
                            <Badge variant="outline">Required</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                            <code>{"{{sender_title}}"}</code>
                            <Badge variant="outline">Required</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                            <code>{"{{day}}"}</code>
                            <Badge variant="outline">Optional</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="p-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Template Settings</CardTitle>
                    <CardDescription>Configure settings for this email template.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Template Name</label>
                      <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background">
                        <option>Cold Outreach</option>
                        <option>Follow-up</option>
                        <option>Demo</option>
                        <option>Re-engagement</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject Line</label>
                      <Input defaultValue="Improving {{pain_point}} at {{company}}" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="active" name="status" defaultChecked />
                          <label htmlFor="active">Active</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="draft" name="status" />
                          <label htmlFor="draft">Draft</label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
