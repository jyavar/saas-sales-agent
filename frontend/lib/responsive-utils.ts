// Standard responsive breakpoints reference
// sm: 640px and up
// md: 768px and up
// lg: 1024px and up
// xl: 1280px and up
// 2xl: 1536px and up

// Common responsive layout classes
export const containerClasses = "container px-4 md:px-6 mx-auto"

// Common responsive grid layouts
export const responsiveGridClasses = {
  // 1 column mobile, 2 columns tablet, 3 columns desktop
  standard: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  // 1 column mobile, 2 columns tablet, 4 columns desktop
  wide: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
  // 1 column mobile, 3 columns tablet, 6 columns desktop (for small cards)
  metrics: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
  // 1 column mobile, 2 columns desktop (for content and sidebar)
  contentWithSidebar: "grid grid-cols-1 lg:grid-cols-12 gap-6",
}

// Common responsive text sizes
export const responsiveTextClasses = {
  heading1: "text-3xl md:text-4xl lg:text-5xl font-bold",
  heading2: "text-2xl md:text-3xl font-bold",
  heading3: "text-xl md:text-2xl font-bold",
  paragraph: "text-base md:text-lg",
}

// Common responsive spacing
export const responsiveSpacingClasses = {
  section: "py-12 md:py-16 lg:py-20",
  sectionGap: "space-y-8 md:space-y-12",
  componentGap: "space-y-4 md:space-y-6",
}

// Common responsive flex layouts
export const responsiveFlexClasses = {
  // Stack on mobile, row on tablet and up
  stackToRow: "flex flex-col md:flex-row",
  // Center on mobile, space between on tablet and up
  centerToSpaceBetween: "flex flex-col items-center md:flex-row md:items-center md:justify-between",
}
