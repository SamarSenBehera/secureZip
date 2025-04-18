import type React from "react"
import Link from "next/link"
import {
  FileArchive,
  FilePlus2Icon as FileSplit2,
  FileDown,
  FileKey,
  FileText,
  FileImage,
  FileSpreadsheet,
  FilePieChart,
  FileSignature,
  FileWarning,
  FileUp,
  FileCode,
  Shield,
  Zap,
  Lock,
} from "lucide-react"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

interface ToolCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  isNew?: boolean
}

function ToolCard({ icon, title, description, href, isNew }: ToolCardProps) {
  return (
    <Link href={href} className="tool-card p-6">
      <div className="relative">
        <div className="tool-icon-wrapper">{icon}</div>
        {isNew && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-medium">
            New!
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </Link>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-primary-100 hover:shadow-lg transition-all">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden hero-pattern">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white opacity-70"></div>
          <div className="container relative px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="purple-gradient-text">Secure</span> your files with next-gen compression
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  SecureZip combines advanced compression with military-grade encryption using our proprietary Dynamic
                  Keyed Dictionary (DKD) algorithm.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary-700">
                    <Link href="/compress">Get Started</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary-50"
                  >
                    <Link href="#tools">Explore Tools</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="relative w-full h-[400px] flex items-center justify-center">
                  <div className="absolute w-64 h-64 bg-primary-300 rounded-full opacity-20 animate-pulse-slow"></div>
                  <div className="absolute w-48 h-48 bg-primary-400 rounded-full opacity-20 animate-float"></div>
                  <div className="relative z-10 glass-card p-8 w-80 animate-float">
                    <div className="flex items-center justify-center mb-4">
                      <FileArchive className="h-16 w-16 text-primary" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-2 bg-primary-200 rounded-full w-3/4 mx-auto"></div>
                      <div className="h-2 bg-primary-200 rounded-full w-full mx-auto"></div>
                      <div className="h-2 bg-primary-200 rounded-full w-5/6 mx-auto"></div>
                    </div>
                    <div className="mt-6 flex justify-center">
                      <div className="h-8 w-24 bg-primary rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose SecureZip?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our innovative DKD technology offers unparalleled security and efficiency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-12 w-12" />}
                title="Lightning Fast"
                description="Advanced compression algorithms reduce file sizes while maintaining quality"
              />
              <FeatureCard
                icon={<Shield className="h-12 w-12" />}
                title="Military-Grade Security"
                description="DKD encryption protects your files with unbreakable security"
              />
              <FeatureCard
                icon={<Lock className="h-12 w-12" />}
                title="Privacy First"
                description="Your files are never stored on our servers longer than necessary"
              />
            </div>
          </div>
        </section>

        <section id="tools" className="py-16 bg-gradient-to-b from-white to-primary-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">All the Tools You Need</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Every tool you need to work with ZIP files, all in one place
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ToolCard
                icon={<FileArchive className="h-8 w-8 text-primary" />}
                title="Merge ZIP"
                description="Combine multiple ZIP files into one single archive"
                href="/merge"
              />
              <ToolCard
                icon={<FileSplit2 className="h-8 w-8 text-primary" />}
                title="Split ZIP"
                description="Separate one ZIP file into multiple smaller archives"
                href="/split"
              />
              <ToolCard
                icon={<FileDown className="h-8 w-8 text-primary" />}
                title="Compress ZIP"
                description="Reduce file size while optimizing for maximum quality"
                href="/compress"
              />
              <ToolCard
                icon={<FileKey className="h-8 w-8 text-primary" />}
                title="Encrypt ZIP"
                description="Secure your ZIP files with password protection"
                href="/encrypt"
                isNew={true}
              />
              <ToolCard
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="ZIP to TXT"
                description="Extract text content from ZIP files easily"
                href="/to-txt"
              />
              <ToolCard
                icon={<FileImage className="h-8 w-8 text-primary" />}
                title="ZIP to JPG"
                description="Convert each ZIP file page into a JPG image"
                href="/to-jpg"
              />
              <ToolCard
                icon={<FileSpreadsheet className="h-8 w-8 text-primary" />}
                title="ZIP to Excel"
                description="Pull data straight from ZIPs into Excel spreadsheets"
                href="/to-excel"
              />
              <ToolCard
                icon={<FilePieChart className="h-8 w-8 text-primary" />}
                title="ZIP to PowerPoint"
                description="Turn your ZIP files into easy-to-edit presentations"
                href="/to-ppt"
              />
              <ToolCard
                icon={<FileSignature className="h-8 w-8 text-primary" />}
                title="Sign ZIP"
                description="Sign yourself or request electronic signatures"
                href="/sign"
              />
              <ToolCard
                icon={<FileWarning className="h-8 w-8 text-primary" />}
                title="Unlock ZIP"
                description="Remove ZIP password security to access your files"
                href="/unlock"
              />
              <ToolCard
                icon={<FileUp className="h-8 w-8 text-primary" />}
                title="Rotate ZIP"
                description="Rotate your ZIP files the way you need them"
                href="/rotate"
              />
              <ToolCard
                icon={<FileCode className="h-8 w-8 text-primary" />}
                title="HTML to ZIP"
                description="Convert webpages to ZIP format easily"
                href="/html-to-zip"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to secure your files?</h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of users who trust SecureZip for their file compression and security needs.
              </p>
              <Button asChild size="lg" className="bg-white text-primary-700 hover:bg-primary-100">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo />
              <p className="mt-4 text-gray-400 text-sm">
                Secure file compression and encryption using our proprietary DKD algorithm.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/compress" className="text-gray-400 hover:text-white">
                    Compress ZIP
                  </Link>
                </li>
                <li>
                  <Link href="/merge" className="text-gray-400 hover:text-white">
                    Merge ZIP
                  </Link>
                </li>
                <li>
                  <Link href="/split" className="text-gray-400 hover:text-white">
                    Split ZIP
                  </Link>
                </li>
                <li>
                  <Link href="/encrypt" className="text-gray-400 hover:text-white">
                    Encrypt ZIP
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 SecureZip. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
