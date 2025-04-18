"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, FileUp, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function FileUpload() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [secretKey, setSecretKey] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const processFile = async () => {
    if (!file) {
      setError("Please select a file to process")
      return
    }

    if (!secretKey) {
      setError("Please enter a secret key")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Create a file record in the database
      const { data: fileRecord, error: fileError } = await supabase
        .from("files")
        .insert({
          user_id: user.id,
          original_name: file.name,
          size: file.size,
          status: "processing",
        })
        .select()
        .single()

      if (fileError) throw fileError

      // For now, we'll simulate the processing
      // In a real implementation, you would call your API to process the file
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update the file record with processed information
      // This is a simulation - in reality, you would get this from your processing API
      const processedSize = Math.floor(file.size * 0.7) // Simulate 30% compression

      const { error: updateError } = await supabase
        .from("files")
        .update({
          processed_size: processedSize,
          status: "completed",
          download_url: `https://example.com/files/${fileRecord.id}`, // This would be a real URL in production
        })
        .eq("id", fileRecord.id)

      if (updateError) throw updateError

      toast({
        title: "File processed successfully",
        description: `Your file has been compressed and encrypted.`,
      })

      // Refresh the file history
      router.refresh()

      // Reset the form
      setFile(null)
      setSecretKey("")
    } catch (err) {
      console.error("File processing error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during file processing")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Process a File</CardTitle>
        <CardDescription>Upload a file to compress and encrypt it using our DKD algorithm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input id="file-upload" type="file" className="hidden" onChange={onFileChange} />
          <div className="flex flex-col items-center gap-2">
            <FileUp className="h-10 w-10 text-gray-400" />
            <div className="text-sm font-medium">
              {file ? file.name : "Drag and drop your file here or click to browse"}
            </div>
            {file && <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secret-key">Secret Key</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              id="secret-key"
              type="password"
              placeholder="Enter your secret key"
              className="pl-10"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">
            This key will be used to both compress and encrypt your file. Keep it safe!
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={processFile} disabled={!file || !secretKey || loading} className="w-full">
          {loading ? "Processing..." : "Process File"}
        </Button>
      </CardFooter>
    </Card>
  )
}
