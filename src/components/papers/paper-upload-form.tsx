"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { FileText, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PaperUploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pdfUrl) {
      toast({
        title: "Error",
        description: "Please upload a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const paperData = {
        title: formData.get("title") as string,
        authors: (formData.get("authors") as string)
          .split(",")
          .map((a) => a.trim()),
        abstract: formData.get("abstract") as string,
        pdfUrl: pdfUrl,
        publicationDate: formData.get("publicationDate") as string,
      };

      const response = await fetch("/api/papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paperData),
      });

      if (!response.ok) throw new Error("Failed to create paper");

      toast({
        title: "Success",
        description: "Paper created successfully",
      });

      router.push("/papers");
      router.refresh();
    } catch (error) {
      console.error("Error creating paper:", error);
      toast({
        title: "Error",
        description: "Failed to create paper",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 px-3 w-full">
      <div className="flex gap-4">
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
          className="flex justify-between w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>PDF File</Label>
        <div className="mt-2">
          {!pdfUrl ? (
            <div className="flex items-center gap-4">
              <UploadButton
                endpoint="pdfUploader"
                appearance={{
                  button:
                    "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-md ut-uploading:bg-primary/50",
                  container: "w-max",
                  allowedContent: "hidden",
                }}
                content={{
                  button({ ready }) {
                    if (ready)
                      return (
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload PDF
                        </div>
                      );
                    return "Uploading...";
                  },
                }}
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  if (res?.[0]) {
                    setPdfUrl(res[0].url);
                    setFileName(res[0].name);
                    toast({
                      title: "Success",
                      description: "PDF uploaded successfully",
                    });
                  }
                }}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Error",
                    description: error.message || "Failed to upload PDF",
                    variant: "destructive",
                  });
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border p-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm">{fileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto h-8 w-8"
                onClick={() => {
                  setPdfUrl("");
                  setFileName("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={uploading || !pdfUrl}>
        {uploading ? "Creating Paper..." : "Create Paper"}
      </Button>
    </form>
  );
}
