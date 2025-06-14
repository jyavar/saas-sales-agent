import type { Metadata } from "next"

type SeoMetadataProps = {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
}

export function generateMetadata({
  title = "Strato-AI | AI-Powered Sales Campaigns for SaaS",
  description = "Automate your sales outreach with AI-powered campaigns designed for SaaS companies post-MVP.",
  keywords = "AI sales, sales automation, SaaS sales, outbound sales, GitHub integration, AI email campaigns",
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
}: SeoMetadataProps): Metadata {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: ogType,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [ogImage],
    },
  }
}
