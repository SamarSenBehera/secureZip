"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import {
  FileArchive,
  FileDown,
  FilePlus2Icon as FileSplit2,
  FileKey,
  Loader2,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Download,
} from "lucide-react"

import { auth, db } from "@/lib/firebase"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"

interface FileRecord {
  id: string
  fileName: string
  fileSize: number
  toolType: string
  status: string
  createdAt: Date
  processedUrl: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<FileRecord[]>([])
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (!currentUser) {
        router.push("/login")
      } else {
        fetchUserFiles(currentUser.uid)
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchUserFiles = async (userId: string) => {
    try {
      const q = query(collection(db, "files"), where("userId", "==", userId), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(q)
      const fileData: FileRecord[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fileData.push({
          id: doc.id,
          fileName: data.fileName || "Unknown file",
          fileSize: data.fileSize || 0,
          toolType: data.toolType || "unknown",
          status: data.status || "unknown",
          createdAt: data.createdAt?.toDate() || new Date(),
          processedUrl: data.processedUrl || data.originalUrl || null,
        })
      })

      setFiles(fileData)
    } catch (error) {
      console.error("Error fetching files:", error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || ""

    // Image files
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <FileImage className="h-5 w-5 text-primary" />
    }

    // Document files
    if (["pdf", "doc", "docx", "txt", "rtf", "odt"].includes(extension)) {
      return <FileText className="h-5 w-5 text-primary" />
    }

    // Archive files
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return <FileArchive className="h-5 w-5 text-primary" />
    }

    // Video files
    if (["mp4", "avi", "mov", "wmv", "mkv", "webm"].includes(extension)) {
      return <FileVideo className="h-5 w-5 text-primary" />
    }

    // Audio files
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <FileAudio className="h-5 w-5 text-primary" />
    }

    // Default file icon
    return <File className="h-5 w-5 text-primary" />
  }

  const getToolIcon = (toolType: string) => {
    switch (toolType.toLowerCase()) {
      case "compress":
        return <FileDown className="h-5 w-5 text-primary" />
      case "merge":
        return <FileArchive className="h-5 w-5 text-primary" />
      case "split":
        return <FileSplit2 className="h-5 w-5 text-primary" />
      case "encrypt":
        return <FileKey className="h-5 w-5 text-primary" />
      default:
        return <FileArchive className="h-5 w-5 text-primary" />
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-gray-600">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-primary-50 to-white py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.displayName || user?.email?.split("@")[0] || "User"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-600">Total Files</h3>
                <FileArchive className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">{files.length}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-600">Compressed</h3>
                <FileDown className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">
                {files.filter((f) => f.toolType.toLowerCase() === "compress").length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-600">Encrypted</h3>
                <FileKey className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">
                {files.filter((f) => f.toolType.toLowerCase() === "encrypt").length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-600">Split/Merged</h3>
                <FileSplit2 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">
                {files.filter((f) => ["split", "merge"].includes(f.toolType.toLowerCase())).length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-primary-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-primary-100">
              <h2 className="text-xl font-semibold">Recent Files</h2>
            </div>

            {files.length === 0 ? (
              <div className="p-12 text-center">
                <FileArchive className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No files yet</h3>
                <p className="text-gray-500 mb-6">You haven't processed any files yet.</p>
                <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary-700">
                  Process Your First File
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Tool
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-100">
                    {files.map((file) => (
                      <tr key={file.id} className="hover:bg-primary-50/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                              {getFileIcon(file.fileName)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{file.fileName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{file.toolType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatFileSize(file.fileSize)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(file.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              file.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : file.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : file.status === "uploaded"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {file.processedUrl ? (
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-700" asChild>
                              <a
                                href={file.processedUrl}
                                download={file.fileName}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </a>
                            </Button>
                          ) : (
                            <span className="text-gray-400">Unavailable</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary-50 p-3 mb-4">
                  <FileDown className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Compress Files</h3>
                <p className="text-sm text-gray-600 mb-4">Reduce file size while maintaining quality</p>
                <Button
                  variant="outline"
                  className="mt-auto border-primary-200 text-primary hover:bg-primary-50"
                  onClick={() => router.push("/compress")}
                >
                  Compress Now
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary-50 p-3 mb-4">
                  <FileArchive className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Merge Files</h3>
                <p className="text-sm text-gray-600 mb-4">Combine multiple files into one archive</p>
                <Button
                  variant="outline"
                  className="mt-auto border-primary-200 text-primary hover:bg-primary-50"
                  onClick={() => router.push("/merge")}
                >
                  Merge Now
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary-50 p-3 mb-4">
                  <FileSplit2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Split Files</h3>
                <p className="text-sm text-gray-600 mb-4">Divide your files into smaller parts</p>
                <Button
                  variant="outline"
                  className="mt-auto border-primary-200 text-primary hover:bg-primary-50"
                  onClick={() => router.push("/split")}
                >
                  Split Now
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary-50 p-3 mb-4">
                  <FileKey className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Encrypt Files</h3>
                <p className="text-sm text-gray-600 mb-4">Secure your files with password protection</p>
                <Button
                  variant="outline"
                  className="mt-auto border-primary-200 text-primary hover:bg-primary-50"
                  onClick={() => router.push("/encrypt")}
                >
                  Encrypt Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-8">
        <div className="container px-4 md:px-6">
          <p className="text-center text-gray-400 text-sm">© 2023 SecureZip. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
