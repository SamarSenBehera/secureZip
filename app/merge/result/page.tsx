"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Download, CheckCircle, ArrowRight, FileArchive } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getFileById } from "@/lib/storage-service"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

export default function MergeResultPage() {
  const [file, setFile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectAttempted = useRef(false)

  useEffect(() => {
    // Prevent multiple redirect attempts
    if (redirectAttempted.current) return

    const fileId = searchParams.get("id")

    if (!fileId) {
      redirectAttempted.current = true
      router.push("/merge")
      return
    }

    const processedFile = getFileById(fileId)

    if (!processedFile) {
      redirectAttempted.current = true
      router.push("/merge")
      return
    }

    setFile(processedFile)
    setLoading(false)
  }, [router, searchParams])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
              <h1 className="text-4xl font-bold tracking-tight mb-4">Merge Complete!</h1>
              <p className="text-lg text-gray-600">
                Your files have been successfully merged into a single file using our DKD algorithm.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              {/* File result */}
              <div className="mb-8 rounded-xl border border-primary-100 bg-white p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="rounded-full bg-primary-50 p-3 mr-4">
                    <FileArchive className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{file.fileName}</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-primary-100 pb-4">
                    <span className="text-gray-600">File size:</span>
                    <span className="font-medium">{formatFileSize(file.processedSize)}</span>
                  </div>

                  {file.compressionRatio > 0 && (
                    <div className="flex justify-between items-center border-b border-primary-100 pb-4">
                      <span className="text-gray-600">Space saved:</span>
                      <span className="font-medium text-green-600">{file.compressionRatio.toFixed(1)}%</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Ready to download</span>
                  </div>
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
                        Download Merged File
                      </a>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download Merged File
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  className="border-primary-200 text-primary hover:bg-primary-50"
                  onClick={() => router.push("/merge")}
                >
                  Merge More Files
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
                  href="/compress"
                  className="flex flex-col items-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="rounded-full bg-primary-50 p-3 mb-4">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Compress Files</h4>
                  <p className="text-sm text-gray-600 text-center">Reduce file size while maintaining quality</p>
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
    </div>
  )
}
