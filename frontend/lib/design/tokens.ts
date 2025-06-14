/**
 * Design tokens for Strato AI
 * These tokens provide a consistent visual language across the application
 */

export const colors = {
  // Brand colors
  primary: {
    gradient: "from-blue-600 to-indigo-600",
    solid: "bg-blue-600",
    text: "text-blue-600",
    hover: "hover:bg-blue-700",
    border: "border-blue-600",
    focus: "focus:ring-blue-500",
  },
  secondary: {
    gradient: "from-purple-500 to-cyan-500",
    solid: "bg-purple-500",
    text: "text-purple-500",
    hover: "hover:bg-purple-600",
    border: "border-purple-500",
    focus: "focus:ring-purple-500",
  },
  // UI colors
  background: {
    light: "bg-white dark:bg-slate-900",
    subtle: "bg-slate-50 dark:bg-slate-800",
    muted: "bg-slate-100 dark:bg-slate-800/50",
  },
  text: {
    primary: "text-slate-900 dark:text-slate-50",
    secondary: "text-slate-700 dark:text-slate-300",
    muted: "text-slate-500 dark:text-slate-400",
    inverse: "text-white dark:text-slate-900",
  },
  border: {
    default: "border-slate-200 dark:border-slate-700",
    focus: "focus:border-blue-500 dark:focus:border-blue-400",
  },
  status: {
    success: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    warning: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-800 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    },
    error: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
    info: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
  },
}

export const spacing = {
  section: {
    sm: "py-6 md:py-8",
    md: "py-8 md:py-12",
    lg: "py-12 md:py-16 lg:py-20",
  },
  container: "px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl",
  gap: {
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  },
  padding: {
    xs: "p-2",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-12",
  },
}

export const typography = {
  heading: {
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
    h2: "text-3xl md:text-4xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold tracking-tight",
    h4: "text-xl md:text-2xl font-semibold",
    h5: "text-lg md:text-xl font-medium",
    h6: "text-base md:text-lg font-medium",
  },
  body: {
    default: "text-base leading-relaxed",
    lg: "text-lg leading-relaxed",
    sm: "text-sm leading-relaxed",
    xs: "text-xs leading-relaxed",
  },
  weight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },
}

export const effects = {
  shadow: {
    sm: "shadow-sm",
    md: "shadow",
    lg: "shadow-lg",
  },
  transition: {
    fast: "transition-all duration-150",
    default: "transition-all duration-200",
    slow: "transition-all duration-300",
  },
  hover: {
    scale: "hover:scale-105",
    opacity: "hover:opacity-90",
    lift: "hover:-translate-y-1",
  },
}

export const radius = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
}
