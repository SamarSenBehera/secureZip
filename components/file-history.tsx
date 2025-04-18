"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, FileArchive } from "lucide-react"

interface FileRecord {
  id: string
  created_at: string
  original_name: string
  size: number
  processed_size: number | null
  status: string
  download_url: string | null
}

export function FileHistory() {
  const supabase = createClient()
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data, error } = await supabase
            .from("files")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          if (error) throw error
          setFiles(data || [])
        }
      } catch (error) {
        console.error("Error fetching files:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()

    // Subscribe to changes
    const channel = supabase
      .channel("files-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "files",
        },
        () => {
          fetchFiles()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return "N/A"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getCompressionRatio = (original: number, compressed: number | null) => {
    if (compressed === null) return "N/A"
    const ratio = (1 - compressed / original) * 100
    return `${ratio.toFixed(1)}%`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>File History</CardTitle>
        <CardDescription>Your recently processed files</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <FileArchive className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p>You haven't processed any files yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Original Size</TableHead>
                <TableHead>Compressed Size</TableHead>
                <TableHead>Reduction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.original_name}</TableCell>
                  <TableCell>{formatDate(file.created_at)}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{formatFileSize(file.processed_size)}</TableCell>
                  <TableCell>{getCompressionRatio(file.size, file.processed_size)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        file.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : file.status === "processing"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {file.status === "completed" && file.download_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={file.download_url} download>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
