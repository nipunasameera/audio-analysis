"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progressRadix"
import { Upload, FileText, Music, Video, X, CheckCircle } from "lucide-react"
import { deleteFile, uploadFileWithoutUser } from "@/lib/supabase"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    id: string;
    name: string;
    size: number;
    type: string;
    status: string;
    publicUrl?: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fileUrl = sessionStorage.getItem("fileUrl");
    const fileName = sessionStorage.getItem("fileName");
    const fileSize = sessionStorage.getItem("fileSize");
    const fileType = sessionStorage.getItem("fileType");
    const fileStatus = sessionStorage.getItem("fileStatus");

    if (fileUrl) {
      setUploadedFile({
        id: fileUrl,
        name: fileName || "",
        size: parseInt(fileSize || "0"),
        type: fileType || "",
        status: fileStatus || "completed",
        publicUrl: fileUrl
      });
    }
  }, []);
  
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0])
    }
  }, [])

  const handleFile = async (file: File) => {

    setIsUploading(true)
    setUploadProgress(0)

    try {
      setUploadProgress(0)
      // Upload file to Supabase
      const uploadedFileData = await uploadFileWithoutUser(file)


      setUploadProgress(50)
      // Create file object for state and local storage
      const newFile = {
        id: uploadedFileData.path,
        name: uploadedFileData.originalName,
        size: uploadedFileData.size,
        type: uploadedFileData.type,
        status: "completed",
        publicUrl: uploadedFileData.publicUrl
      }

      setUploadProgress(80)

      // Store file information in session storage
      sessionStorage.setItem("fileUrl", uploadedFileData.publicUrl || "");
      sessionStorage.setItem("fileName", uploadedFileData.originalName || "");
      sessionStorage.setItem("fileSize", uploadedFileData.size.toString());
      sessionStorage.setItem("fileType", uploadedFileData.type || "");
      sessionStorage.setItem("fileStatus", "completed");
    

      //setFileUrl(uploadedFileData.publicUrl);

      // Update state and local storage
      setUploadedFile(newFile)

      // Ensure upload progress reaches 100%
      setUploadProgress(100)
      setIsUploading(false)
    } catch (error) {
      console.error("File upload failed", error)
      alert("File upload failed")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const removeFileFromUploaded = async () => {
    if (!uploadedFile) return

    try {
      sessionStorage.removeItem("fileUrl");
      sessionStorage.removeItem("fileName");
      sessionStorage.removeItem("fileSize");
      sessionStorage.removeItem("fileType");
      sessionStorage.removeItem("fileStatus");

      // Delete file from Supabase storage
      await deleteFile(uploadedFile.id)

      // Clear local state and storage
      setUploadedFile(null)
    } catch (error) {
      console.error("File deletion failed", error)
      alert("Failed to delete file")
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("audio/")) return <Music className="w-6 h-6 text-orange-500" />
    if (type.startsWith("video/")) return <Video className="w-6 h-6 text-orange-500" />
    if (type.startsWith("text/")) return <FileText className="w-6 h-6 text-orange-500" />
    return <FileText className="w-6 h-6 text-orange-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">FILE UPLOAD</h1>
          <p className="text-sm text-neutral-400">Upload audio, video, or text files for analysis</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer" 
            onClick={() => {
              const fileInput = document.getElementById("fileInput")
              if (fileInput) {
                fileInput.click()
              }
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-8">
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? "border-orange-500 bg-orange-500/10" : "border-neutral-600 hover:border-orange-500/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="fileInput"
              type="file"
              accept=".mp3,.wav,.mp4,.mov,.avi,.txt,.doc,.docx"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-orange-500" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Drop file here or click to browse</h3>
                <p className="text-sm text-neutral-400 mb-4">Supports MP3, WAV, MP4, MOV, AVI, TXT, DOC files</p>

                <div className="flex flex-wrap justify-center gap-4 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    <span>Audio Files</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Video Files</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Text Files</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Uploading...</span>
                <span className="text-white font-mono">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFile && (
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              UPLOADED FILE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div
                key={uploadedFile.id}
                className="flex items-center justify-between p-4 bg-neutral-800 rounded border border-neutral-700 hover:border-orange-500/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(uploadedFile.type)}
                  <div>
                    <div className="text-sm font-medium text-white">{uploadedFile.name}</div>
                    <div className="text-xs text-neutral-400">
                      {formatFileSize(uploadedFile.size)} • {uploadedFile.type}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-xs text-white uppercase tracking-wider">{uploadedFile.status}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFileFromUploaded}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Requirements */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">FILE REQUIREMENTS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Music className="w-4 h-4 text-orange-500" />
                Audio Files
              </h3>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Formats: MP3, WAV, M4A</li>
                <li>• Max size: 100MB</li>
                <li>• Duration: Up to 2 hours</li>
                <li>• Quality: 16kHz+ recommended</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Video className="w-4 h-4 text-orange-500" />
                Video Files
              </h3>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Formats: MP4, MOV, AVI</li>
                <li>• Max size: 500MB</li>
                <li>• Duration: Up to 1 hour</li>
                <li>• Audio track required</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                Text Files
              </h3>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Formats: TXT, DOC, DOCX</li>
                <li>• Max size: 10MB</li>
                <li>• Encoding: UTF-8</li>
                <li>• Length: Up to 50,000 words</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
