"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Github, Star, GitFork, Users, Code, RefreshCw } from "lucide-react"

export default function RepoPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">GitHub Repository</h2>
          <p className="text-muted-foreground">Analyze your GitHub repository to find potential leads.</p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Github className="h-6 w-6" />
              <CardTitle>acme/saas-product</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>1.2k</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                <span>345</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>42 contributors</span>
              </Badge>
            </div>
          </div>
          <CardDescription>A modern SaaS product for developers. Last analyzed 2 hours ago.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Repository Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stars</span>
                  <span>1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Forks</span>
                  <span>345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Watchers</span>
                  <span>567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Open Issues</span>
                  <span>42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pull Requests</span>
                  <span>18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contributors</span>
                  <span>42</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Detected Features</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Next.js</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>Prisma</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>Auth.js</Badge>
                <Badge>Stripe</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Target Audience</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Developer Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                    Developer Type Chart
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Company Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                    Company Size Chart
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Industry</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground">
                    Industry Chart
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Recent Commits</h3>
            <div className="space-y-4">
              {[
                { author: "johndoe", message: "Fix authentication bug", date: "2 hours ago" },
                { author: "janedoe", message: "Add new dashboard features", date: "1 day ago" },
                { author: "alexsmith", message: "Update documentation", date: "2 days ago" },
                { author: "sarahlee", message: "Refactor API endpoints", date: "3 days ago" },
              ].map((commit, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{commit.message}</p>
                      <p className="text-sm text-muted-foreground">by {commit.author}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{commit.date}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
