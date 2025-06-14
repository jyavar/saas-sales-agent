import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, description, centered = false, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 md:mb-12 lg:mb-16", centered && "text-center max-w-3xl mx-auto", className)}>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter">{title}</h2>
      {description && <p className="mt-4 text-muted-foreground md:text-lg">{description}</p>}
    </div>
  )
}
