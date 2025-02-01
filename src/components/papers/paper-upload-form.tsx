'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateUploadDropzone } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"

const UploadDropzone = generateUploadDropzone<OurFileRouter>()

export function PaperUploadForm() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const paperData = {
        title: formData.get("title") as string,
        authors: (formData.get("authors") as string).split(",").map(a => a.trim()),
        abstract: formData.get("abstract") as string,
        pdfUrl: pdfUrl,
        publicationDate: formData.get("publicationDate") as string,
      }

      const response = await fetch("/api/papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paperData),
      })

      if (!response.ok) throw new Error("Failed to create paper")

      router.push("/papers")
      router.refresh()
    } catch (error) {
      console.error("Error creating paper:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter paper title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="authors">Authors</Label>
        <Input
          id="authors"
          name="authors"
          placeholder="Enter authors (comma separated)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="abstract">Abstract</Label>
        <Textarea
          id="abstract"
          name="abstract"
          placeholder="Enter paper abstract"
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="publicationDate">Publication Date</Label>
        <Input
          id="publicationDate"
          name="publicationDate"
          type="date"
        />
      </div>

      <div className="space-y-2">
        <Label>PDF File</Label>
        <UploadDropzone
          endpoint="pdfUploader"
          onClientUploadComplete={(res) => {
            setPdfUrl(res?.[0]?.url || "")
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error)
          }}
        />
      </div>

      <Button type="submit" disabled={uploading || !pdfUrl}>
        {uploading ? "Uploading..." : "Upload Paper"}
      </Button>
    </form>
  )
}