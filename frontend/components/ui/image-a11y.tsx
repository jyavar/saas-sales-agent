import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface ImageA11yProps extends Omit<ImageProps, "alt"> {
  alt: string
  caption?: string
  decorative?: boolean
}

export function ImageA11y({ alt, caption, decorative = false, className, ...props }: ImageA11yProps) {
  return (
    <figure className={cn("relative", className)}>
      <Image alt={decorative ? "" : alt} aria-hidden={decorative} {...props} />
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{caption}</figcaption>
      )}
    </figure>
  )
}
