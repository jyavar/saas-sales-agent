import type React from "react"
import Sidebar from "@/components/dashboard/Sidebar"
import Topbar from "@/components/dashboard/Topbar"
import type { Metadata } from "next"
import { TenantProvider, TenantGuard } from "@/lib/contexts/TenantContext"
import { AuthGuard } from "@/components/testing/AuthGuard"

export const metadata: Metadata = {
  title: "Dashboard | Strato-AI",
  description: "Strato-AI dashboard for managing your AI sales agent",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TenantProvider>
      <TenantGuard>
        <AuthGuard allowedRoles={["admin", "agent"]}>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="md:pl-64">
              <Topbar />
              <main className="p-4 md:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </AuthGuard>
      </TenantGuard>
    </TenantProvider>
  )
}
