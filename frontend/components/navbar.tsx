"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { motion } from "framer-motion"
import { routes } from "@/lib/routes"

export function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Don't show navbar on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname?.startsWith(path)) return true
    return false
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/95 backdrop-blur-md border-b shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href={routes.home} className="flex items-center space-x-2">
            <span className="font-bold text-xl">Strato AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href={routes.features} className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </Link>
            <Link href={routes.pricing} className="transition-colors hover:text-foreground/80 text-foreground/60">
              Pricing
            </Link>
            <Link href={routes.about} className="transition-colors hover:text-foreground/80 text-foreground/60">
              About
            </Link>
            <Link href={routes.contact} className="transition-colors hover:text-foreground/80 text-foreground/60">
              Contact
            </Link>
          </nav>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link href={routes.login}>Log in</Link>
          </Button>
          <Button
            asChild
            className="hidden md:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Link href={routes.signup}>Sign up</Link>
          </Button>
          <ModeToggle />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  href={routes.home}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-blue-600",
                    isActive(routes.home) && "text-blue-600",
                  )}
                >
                  Home
                </Link>
                <Link
                  href={routes.features}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-blue-600",
                    isActive(routes.features) && "text-blue-600",
                  )}
                >
                  Features
                </Link>
                <Link
                  href={routes.pricing}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-blue-600",
                    isActive(routes.pricing) && "text-blue-600",
                  )}
                >
                  Pricing
                </Link>
                <Link
                  href={routes.about}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-blue-600",
                    isActive(routes.about) && "text-blue-600",
                  )}
                >
                  About
                </Link>
                <Link
                  href={routes.contact}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-blue-600",
                    isActive(routes.contact) && "text-blue-600",
                  )}
                >
                  Contact
                </Link>
                <Link href={routes.login} className="text-lg font-medium transition-colors hover:text-blue-600">
                  Log in
                </Link>
                <Button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Link href={routes.signup}>Sign up</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
