"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, History } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const tools = [
  { name: "MERGE PDF", href: "/merge" },
  { name: "SPLIT PDF", href: "/split" },
  { name: "ENCRYPT PDF", href: "/encrypt" },
  { name: "COMPRESS PDF", href: "/compress" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-primary-100">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex md:gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === tool.href ? "text-primary font-semibold" : "text-foreground",
                )}
              >
                {tool.name}
              </Link>
            ))}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-sm font-medium group-hover:text-primary"
                onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              >
                ALL PDF TOOLS
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              {toolsMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 space-y-1">
                  <Link href="/merge" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-primary-50">
                    Merge PDF
                  </Link>
                  <Link href="/split" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-primary-50">
                    Split PDF
                  </Link>
                  <Link
                    href="/compress"
                    className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-primary-50"
                  >
                    Compress PDF
                  </Link>
                  <Link
                    href="/encrypt"
                    className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-primary-50"
                  >
                    Encrypt PDF
                  </Link>
                  <Link
                    href="/watermark"
                    className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-primary-50"
                  >
                    Watermark PDF
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:flex hover:bg-primary-50 hover:text-primary-700"
          >
            <Link href="/history">
              <History className="h-4 w-4 mr-2" />
              History
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden md:flex bg-primary hover:bg-primary-700">
            <Link href="/merge">Get Started</Link>
          </Button>
          <button
            className="md:hidden text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-4 pb-4">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === tool.href ? "text-primary" : "text-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {tool.name}
              </Link>
            ))}
            <Link
              href="/all-tools"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              ALL PDF TOOLS
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <History className="h-4 w-4 inline mr-2" />
              History
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Button asChild size="sm" className="bg-primary hover:bg-primary-700">
                <Link href="/merge" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
