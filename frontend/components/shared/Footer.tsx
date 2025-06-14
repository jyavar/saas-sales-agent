"use client"

import { Twitter, Linkedin, Github, Mail } from "lucide-react"

const navigation = {
  product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Demo", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Privacy", href: "#" },
  ],
}

const social = [
  {
    name: "Twitter",
    href: "#",
    icon: Twitter,
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    href: "#",
    icon: Github,
  },
  {
    name: "Email",
    href: "#",
    icon: Mail,
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-xl font-bold mb-4">Strato AI</div>
            <p className="text-gray-400 mb-4">
              The AI sales agent that works 24/7 to convert your leads into paying customers. Perfect for solo founders
              who want to scale without hiring a sales team.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-white">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="hover:text-white">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Strato AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
