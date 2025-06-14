"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Home, LayoutDashboard, Mail, MessageSquare, Settings, Users, Github } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: Mail,
  },
  {
    title: "Leads",
    href: "/dashboard/leads",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "GitHub Repo",
    href: "/dashboard/repo",
    icon: Github,
  },
  {
    title: "Email Templates",
    href: "/dashboard/templates",
    icon: Mail,
    badge: "New",
  },
  {
    title: "AI Assistant",
    href: "/dashboard/assistant",
    icon: MessageSquare,
    badge: "Beta",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
      <div className="flex flex-col flex-1 border-r bg-background">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <span className="font-bold text-xl gradient-text">Strato-AI</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn("w-full justify-start gap-3 mb-1", pathname === item.href && "bg-muted")}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge variant="outline" className="ml-auto gradient-bg text-white">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Home className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Acme Inc</span>
              <span className="text-xs text-muted-foreground">Free Plan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
