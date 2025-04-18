// Types for our local storage
export interface ProcessedFile {
  id: string
  fileName: string
  originalSize: number
  processedSize: number
  compressionRatio: number
  toolType: string
  status: "processing" | "completed" | "failed"
  createdAt: string
  downloadUrl: string
  password?: string
  iv?: string
  encryptedKey?: string
}

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Save a file to localStorage
export const saveFile = (file: ProcessedFile): void => {
  const files = getFiles()
  files.unshift(file) // Add to the beginning of the array
  localStorage.setItem("securezip_files", JSON.stringify(files))
}

// Get all files from localStorage
export const getFiles = (): ProcessedFile[] => {
  const filesJson = localStorage.getItem("securezip_files")
  return filesJson ? JSON.parse(filesJson) : []
}

// Get files by tool type
export const getFilesByToolType = (toolType: string): ProcessedFile[] => {
  return getFiles().filter((file) => file.toolType === toolType)
}

// Get a file by ID
export const getFileById = (id: string): ProcessedFile | undefined => {
  return getFiles().find((file) => file.id === id)
}

// Update a file
export const updateFile = (id: string, updates: Partial<ProcessedFile>): void => {
  const files = getFiles()
  const index = files.findIndex((file) => file.id === id)

  if (index !== -1) {
    files[index] = { ...files[index], ...updates }
    localStorage.setItem("securezip_files", JSON.stringify(files))
  }
}

// Delete a file
export const deleteFile = (id: string): void => {
  const files = getFiles().filter((file) => file.id !== id)
  localStorage.setItem("securezip_files", JSON.stringify(files))
}

// Clear all files
export const clearFiles = (): void => {
  localStorage.removeItem("securezip_files")
}
