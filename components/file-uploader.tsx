"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, FileArchive, Shield, File, FileText, FileImage, FileVideo, FileAudio, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploaderProps {
  toolType: string
  onFilesSelected: (files: File[]) => void
  allowMultiple?: boolean
  acceptedFileTypes?: string
  maxFileSize?: number // in MB
  requirePassword?: boolean
  onPasswordChange?: (password: string) => void
  onProcessFiles?: () => void
  isProcessing?: boolean
  progress?: number
  errorMessage?: string
}

export function FileUploader({
  toolType,
  onFilesSelected,
  allowMultiple = false,
  acceptedFileTypes = "*", // Accept all file types by default
  maxFileSize = 100, // Default max file size is 100MB
  requirePassword = false,
  onPasswordChange,
  onProcessFiles,
  isProcessing = false,
  progress = 0,
  errorMessage,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [password, setPassword] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      handleFiles(newFiles)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      handleFiles(newFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    // Check file size
    const oversizedFiles = newFiles.filter((file) => file.size > maxFileSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`Some files exceed the maximum size of ${maxFileSize}MB`)
      return
    }

    // Filter for accepted file types if specified
    if (acceptedFileTypes !== "*") {
      const validExtensions = acceptedFileTypes.split(",")
      const validFiles = newFiles.filter((file) => {
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
        return validExtensions.includes(fileExtension)
      })

      if (validFiles.length === 0) {
        alert(`Please select valid files (${acceptedFileTypes})`)
        return
      }

      if (validFiles.length !== newFiles.length) {
        alert(`Some files were filtered out because they don't match the accepted types (${acceptedFileTypes})`)
      }

      newFiles = validFiles
    }

    if (allowMultiple) {
      setFiles((prev) => [...prev, ...newFiles])
      onFilesSelected([...files, ...newFiles])
    } else {
      setFiles(newFiles.slice(0, 1))
      onFilesSelected(newFiles.slice(0, 1))
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || ""

    // Image files
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <FileImage className="h-6 w-6 text-primary" />
    }

    // Document files
    if (["pdf", "doc", "docx", "txt", "rtf", "odt"].includes(extension)) {
      return <FileText className="h-6 w-6 text-primary" />
    }

    // Archive files
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
      return <FileArchive className="h-6 w-6 text-primary" />
    }

    // Video files
    if (["mp4", "avi", "mov", "wmv", "mkv", "webm"].includes(extension)) {
      return <FileVideo className="h-6 w-6 text-primary" />
    }

    // Audio files
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(extension)) {
      return <FileAudio className="h-6 w-6 text-primary" />
    }

    // Default file icon
    return <File className="h-6 w-6 text-primary" />
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (onPasswordChange) {
      onPasswordChange(e.target.value)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {files.length === 0 ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging ? "border-primary bg-primary-50" : "border-primary-200"
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-100 rounded-full animate-pulse-slow"></div>
              <div className="relative rounded-full bg-primary-50 p-5">
                <Upload className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Drag & drop your files here</h3>
              <p className="text-sm text-gray-500">or</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary-700 px-6 py-2"
              >
                Choose Files
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="h-4 w-4 text-primary-400" />
              <span>Files are encrypted with DKD technology</span>
            </div>
            <p className="text-xs text-gray-500">Maximum file size: {maxFileSize}MB</p>
            {acceptedFileTypes !== "*" && (
              <p className="text-xs text-gray-500">Accepted file types: {acceptedFileTypes}</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple={allowMultiple}
            accept={acceptedFileTypes}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-primary-100 bg-white p-6 shadow-md">
            <div className="space-y-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary-50 p-3">{getFileIcon(file.name)}</div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-primary hover:bg-primary-50"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              ))}
            </div>
            {allowMultiple && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="border-primary-200 text-primary hover:bg-primary-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add More Files
                </Button>
              </div>
            )}
          </div>

          {/* Password input if required */}
          {requirePassword && (
            <div className="rounded-xl border border-primary-100 bg-white p-6 shadow-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password Protection
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password to protect your file"
                    className="pl-10"
                    value={password}
                    onChange={handlePasswordChange}
                    required={requirePassword}
                  />
                </div>
                <p className="text-xs text-gray-500">This password will be required to access your file.</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {isProcessing ? (
            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block text-primary">
                      {progress < 100 ? "Processing" : "Finalizing"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary">{Math.round(progress)}%</span>
                  </div>
                </div>
                <Progress value={progress} className="h-2 w-full bg-primary-100" />
              </div>
              <p className="text-center text-sm text-gray-500">
                {progress < 100
                  ? "Processing your file(s)... Please wait."
                  : "Finalizing your file(s) with DKD algorithm..."}
              </p>
            </div>
          ) : (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setFiles([])
                  onFilesSelected([])
                }}
                className="border-primary-200 text-primary hover:bg-primary-50"
              >
                Clear
              </Button>
              <Button
                className="bg-primary hover:bg-primary-700"
                onClick={onProcessFiles}
                disabled={files.length === 0 || (requirePassword && !password)}
              >
                Process {files.length > 1 ? `${files.length} Files` : "File"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
