import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTenant } from "@/lib/contexts/TenantContext"

// Lazy load componentes pesados del dashboard
const CampaignStats = dynamic(() => import("@/components/dashboard/CampaignStats"), {
  loading: () => <Skeleton className="h-32 w-full" />,
  ssr: false,
})

const RecentActivity = dynamic(() => import("@/components/dashboard/RecentActivity"), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
})

const PerformanceChart = dynamic(() => import("@/components/dashboard/PerformanceChart"), {
  loading: () => <Skeleton className="h-80 w-full" />,
  ssr: false,
})

export default function DashboardPage() {
  const { tenant, loading, error } = useTenant();

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          {loading ? "Cargando tenant..." : error ? `Error: ${error}` : tenant ? `Bienvenido a ${tenant.name}` : "Welcome back! Here's what's happening with your campaigns."}
        </p>
      </div>

      {/* Stats que se cargan inmediatamente */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CampaignStats title="Total Leads" value="1,284" description="+12% from last month" trend={{ value: "+12%", positive: true }} />
        <CampaignStats title="Conversion Rate" value="6.8%" description="+2.3% from last month" trend={{ value: "+2.3%", positive: true }} />
        <CampaignStats title="Active Campaigns" value="12" description="+3 from last month" trend={{ value: "+3", positive: true }} />
        <CampaignStats title="Revenue" value="$24,500" description="+18% from last month" trend={{ value: "+18%", positive: true }} />
      </div>

      {/* Componentes lazy loaded */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            <PerformanceChart />
          </Suspense>
        </div>
        <div className="col-span-3">
          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          {/* Puedes pasar props de ejemplo aquí si CampaignStats es el único componente */}
          {/* <CampaignStats title="Example" value="123" /> */}
        </Suspense>
      </div>
    </div>
  )
}
