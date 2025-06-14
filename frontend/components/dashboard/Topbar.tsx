"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/shared/ModeToggle"
import { usePathname } from "next/navigation"
import { routes } from "@/lib/routes"
import Link from "next/link"
import Sidebar from "@/components/dashboard/Sidebar"

export default function Topbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center gap-2 mb-8">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                  <span className="font-bold text-xl gradient-text">Strato-AI</span>
                </Link>
              </div>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div className="hidden md:flex">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              <Button variant="ghost" asChild className={pathname === "/dashboard" ? "bg-muted" : ""}>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild className={pathname.startsWith("/dashboard/campaigns") ? "bg-muted" : ""}>
                <Link href="/dashboard/campaigns">Campaigns</Link>
              </Button>
              <Button variant="ghost" asChild className={pathname.startsWith("/dashboard/leads") ? "bg-muted" : ""}>
                <Link href="/dashboard/leads">Leads</Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={routes.login}>Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
