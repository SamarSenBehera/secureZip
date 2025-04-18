"use client"

import { useState } from "react"
import { FileKey } from "lucide-react"
import { useRouter } from "next/navigation"

import { Header } from "@/components/header"
import { FileUploader } from "@/components/file-uploader"
import { processFileWithDKD } from "@/lib/file-processor"

export default function EncryptPage() {
  const [files, setFiles] = useState<File[]>([])
  const [password, setPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
  }

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
  }

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      setError("Please select a file to encrypt")
      return
    }

    if (!password) {
      setError("Please enter a password to protect your file")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 300)

      // Process file with DKD encryption
      const result = await processFileWithDKD(files[0], "encrypt", { password })

      // Complete the progress
      clearInterval(progressInterval)
      setProgress(100)

      // Navigate to result page
      setTimeout(() => {
        setIsProcessing(false)
        router.push(`/encrypt/result?id=${result.id}`)
      }, 1000)
    } catch (err) {
      console.error("Process error:", err)
      setError("Error encrypting file. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-purple-gradient py-16 text-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <FileKey className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">Encrypt PDFs</h1>
              <p className="text-lg text-white/80">
                Secure your files with military-grade encryption using our DKD algorithm. Protect your sensitive data
                from unauthorized access.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <FileUploader
              toolType="encrypt"
              acceptedFileTypes=".pdf"
              allowMultiple={false}
              maxFileSize={200}
              requirePassword={true}
              onFilesSelected={handleFilesSelected}
              onPasswordChange={handlePasswordChange}
              onProcessFiles={handleProcessFiles}
              isProcessing={isProcessing}
              progress={progress}
              errorMessage={error || undefined}
            />

            <div className="mt-16 mx-auto max-w-3xl">
              <h2 className="text-2xl font-semibold mb-6 text-center">How to encrypt files</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Upload</h3>
                  <p className="text-sm text-gray-600">Select or drag and drop your file to the upload area above.</p>
                </div>

                <div className="flex flex-col items-center text-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Set Password</h3>
                  <p className="text-sm text-gray-600">Enter a strong password to protect your file.</p>
                </div>

                <div className="flex flex-col items-center text-center p-6 rounded-xl border border-primary-100 bg-white shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Download</h3>
                  <p className="text-sm text-gray-600">Download your encrypted file with password protection.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
