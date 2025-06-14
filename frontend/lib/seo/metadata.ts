import type { Metadata } from "next"

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
}

export function generateMetadata(config: SEOConfig): Metadata {
  const { title, description, keywords = [], canonical, ogImage = "/og-image.jpg" } = config

  const fullTitle = title.includes("Strato") ? title : `${title} | Strato AI`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    canonical,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: "Strato AI",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}
