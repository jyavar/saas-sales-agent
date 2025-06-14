import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface SeoImageProps extends Omit<ImageProps, "alt"> {
  alt: string
  caption?: string
  decorative?: boolean
  priority?: boolean
  testId?: string
}

export function SeoImage({
  alt,
  caption,
  decorative = false,
  priority = false,
  className,
  testId,
  ...props
}: SeoImageProps) {
  return (
    <figure className={cn("relative", className)} data-testid={testId}>
      <Image
        alt={decorative ? "" : alt}
        aria-hidden={decorative}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{caption}</figcaption>
      )}
    </figure>
  )
}
