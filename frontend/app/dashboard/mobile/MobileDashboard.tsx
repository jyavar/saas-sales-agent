"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

// Lazy load componentes pesados solo cuando son necesarios
const MobileChart = dynamic(() => import("./MobileChart"), {
  loading: () => <Skeleton className="h-48 w-full" />,
  ssr: false,
})

const MobileCampaignList = dynamic(() => import("./MobileCampaignList"), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
})

const MobileLeadsList = dynamic(() => import("./MobileLeadsList"), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false,
})

interface MobileDashboardProps {
  initialData: {
    stats: Array<{ label: string; value: string; change: string }>
    campaigns: Array<{ id: string; name: string; status: string }>
    leads: Array<{ id: string; name: string; company: string }>
  }
}

export default function MobileDashboard({ initialData }: MobileDashboardProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["stats"]))
  const [visibleComponents, setVisibleComponents] = useState<Set<string>>(new Set(["stats"]))

  // Optimización: Solo renderizar componentes visibles en móvil
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    const newVisible = new Set(visibleComponents)

    if (expandedSections.has(section)) {
      newExpanded.delete(section)
      // Delay para permitir animación antes de unmount
      setTimeout(() => {
        setVisibleComponents((prev) => {
          const updated = new Set(prev)
          updated.delete(section)
          return updated
        })
      }, 300)
    } else {
      newExpanded.add(section)
      newVisible.add(section)
      setVisibleComponents(newVisible)
    }

    setExpandedSections(newExpanded)
  }

  // Memoizar stats para evitar re-renders innecesarios
  const memoizedStats = useMemo(() => initialData.stats, [initialData.stats])

  if (!isMobile) {
    // Renderizar dashboard desktop normal
    return null
  }

  return (
    <div className="space-y-4 p-4">
      {/* Stats siempre visibles */}
      <div className="grid grid-cols-2 gap-3">
        {memoizedStats.map((stat, index) => (
          <Card key={index} className="p-3">
            <CardContent className="p-0">
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-green-600">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secciones colapsables para optimizar performance */}
      <div className="space-y-3">
        {/* Charts Section */}
        <Card>
          <CardHeader className="pb-2">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => toggleSection("charts")}
            >
              <CardTitle className="text-sm">Performance Charts</CardTitle>
              {expandedSections.has("charts") ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
          {expandedSections.has("charts") && (
            <CardContent className="pt-0">{visibleComponents.has("charts") && <MobileChart />}</CardContent>
          )}
        </Card>

        {/* Campaigns Section */}
        <Card>
          <CardHeader className="pb-2">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => toggleSection("campaigns")}
            >
              <CardTitle className="text-sm">Recent Campaigns</CardTitle>
              {expandedSections.has("campaigns") ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          {expandedSections.has("campaigns") && (
            <CardContent className="pt-0">
              {visibleComponents.has("campaigns") && <MobileCampaignList campaigns={initialData.campaigns} />}
            </CardContent>
          )}
        </Card>

        {/* Leads Section */}
        <Card>
          <CardHeader className="pb-2">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => toggleSection("leads")}
            >
              <CardTitle className="text-sm">Recent Leads</CardTitle>
              {expandedSections.has("leads") ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardHeader>
          {expandedSections.has("leads") && (
            <CardContent className="pt-0">
              {visibleComponents.has("leads") && <MobileLeadsList leads={initialData.leads} />}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
