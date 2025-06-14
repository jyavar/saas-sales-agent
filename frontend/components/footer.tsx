"use client"

import Link from "next/link"
import { Twitter, Github, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  // Don't show footer on dashboard pages
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
    return null
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/40 border-t border-border">
      <div className="container py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo and pitch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <span className="font-bold text-xl gradient-text">Strato-AI</span>
            </Link>
            <p className="text-muted-foreground mb-4">Your AI-powered Sales Co-Founder.</p>
            <div className="flex space-x-4 mt-2">
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-muted-foreground hover:text-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </motion.div>

          {/* Column 2: Site Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-4">Site Map</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Contact & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-4">Contact & Legal</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span className="text-muted-foreground">hello@stratoai.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span className="text-muted-foreground">+1 (555) 000-0000</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <span className="text-muted-foreground">
                  100 Main Street
                  <br />
                  San Francisco, CA 94105
                </span>
              </li>
              <li className="pt-2">
                <Link href="/privacy" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Strato-AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
