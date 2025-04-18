"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Download, CheckCircle, ArrowRight, File } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getFileById } from "@/lib/storage-service"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function CompressResultPage() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectAttempted = useRef(false)

  useEffect(() => {
    // Prevent multiple redirect attempts
    if (redirectAttempted.current) return

    const fileIds = searchParams.get("ids")?.split(",") || []

    if (fileIds.length === 0) {
      redirectAttempted.current = true
      router.push("/compress")
      return
    }

    const processedFiles = fileIds.map((id) => getFileById(id)).filter(Boolean)

    if (processedFiles.length === 0) {
      redirectAttempted.current = true
      router.push("/compress")
      return
    }

    setFiles(processedFiles)
    setLoading(false)
  }, [router, searchParams])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTotalSavings = () => {
    const totalOriginal = files.reduce((sum, file) => sum + file.originalSize, 0)
    const totalCompressed = files.reduce((sum, file) => sum + file.processedSize, 0)
    const savedBytes = totalOriginal - totalCompressed
    return formatFileSize(savedBytes)
  }

  const getAverageCompressionRatio = () => {
    if (files.length === 0) return 0
    const totalRatio = files.reduce((sum, file) => sum + file.compressionRatio, 0)
    return (totalRatio / files.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <svg
                className="h-8 w-8 text-primary animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-gray-600">Processing your files...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary-50 to-white py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 pulse-glow">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Compression Complete!</h1>
              <p className="text-lg text-gray-600">
                Your {files.length > 1 ? `${files.length} files have` : "file has"} been successfully compressed and
                encrypted using our DKD algorithm.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              {/* Summary stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-md text-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Files Processed</h3>
                  <p className="text-3xl font-bold text-primary">{files.length}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-md text-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Space Saved</h3>
                  <p className="text-3xl font-bold text-primary">{getTotalSavings()}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-md text-center">
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">Average Reduction</h3>
                  <p className="text-3xl font-bold text-primary">{getAverageCompressionRatio()}%</p>
                </div>
              </div>

              {/* File results */}
              {files.map((file) => (
                <div key={file.id} className="mb-8 rounded-xl border border-primary-100 bg-white p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="rounded-full bg-primary-50 p-3 mr-4">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">{file.fileName}</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-primary-100 pb-4">
                      <span className="text-gray-600">Original size:</span>
                      <span className="font-medium">{formatFileSize(file.originalSize)}</span>
                    </div>

                    <div className="flex justify-between items-center border-b border-primary-100 pb-4">
                      <span className="text-gray-600">Compressed size:</span>
                      <span className="font-medium">{formatFileSize(file.processedSize)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Compression ratio:</span>
                      <span className="font-medium text-primary">{file.compressionRatio.toFixed(1)}% smaller</span>
                    </div>

                    {file.password && (
                      <div className="flex justify-between items-center border-t border-primary-100 pt-4">
                        <span className="text-gray-600">Password protection:</span>
                        <span className="font-medium text-primary">Enabled</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button
                      className="w-full bg-primary hover:bg-primary-700 py-4"
                      asChild={!!file.downloadUrl}
                      disabled={!file.downloadUrl}
                    >
                      {file.downloadUrl ? (
                        <a href={file.downloadUrl} download={file.fileName}>
                          <Download className="mr-2 h-5 w-5" />
                          Download Compressed File
                        </a>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Download Compressed File
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  className="border-primary-200 text-primary hover:bg-primary-50"
                  onClick={() => router.push("/compress")}
                >
                  Compress More Files
                </Button>

                <Button
                  variant="outline"
                  className="border-primary-200 text-primary hover:bg-primary-50"
                  onClick={() => router.push("/")}
                >
                  Go to Home
                </Button>
              </div>
            </div>

            <div className="mt-16 mx-auto max-w-3xl">
              <h3 className="text-2xl font-semibold mb-6 text-center">Need more tools?</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Link
                  href="/merge"
                  className="flex flex-col items-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="rounded-full bg-primary-50 p-3 mb-4">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Merge Files</h4>
                  <p className="text-sm text-gray-600 text-center">Combine multiple files into one archive</p>
                </Link>

                <Link
                  href="/split"
                  className="flex flex-col items-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="rounded-full bg-primary-50 p-3 mb-4">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Split Files</h4>
                  <p className="text-sm text-gray-600 text-center">Divide your files into smaller parts</p>
                </Link>

                <Link
                  href="/encrypt"
                  className="flex flex-col items-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="rounded-full bg-primary-50 p-3 mb-4">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Encrypt Files</h4>
                  <p className="text-sm text-gray-600 text-center">Secure your files with password protection</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SecureZip</h3>
              <p className="text-gray-400 text-sm">
                Secure file compression and encryption using our proprietary DKD algorithm.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/compress" className="text-gray-400 hover:text-white">
                    Compress Files
                  </a>
                </li>
                <li>
                  <a href="/merge" className="text-gray-400 hover:text-white">
                    Merge Files
                  </a>
                </li>
                <li>
                  <a href="/split" className="text-gray-400 hover:text-white">
                    Split Files
                  </a>
                </li>
                <li>
                  <a href="/encrypt" className="text-gray-400 hover:text-white">
                    Encrypt Files
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/careers" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center md:text-left">
            <p className="text-gray-400 text-sm">© 2023 SecureZip. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
