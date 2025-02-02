"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateUploadDropzone } from "@uploadthing/react";

const UploadDropzone = generateUploadDropzone<OurFileRouter>();
interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
}

export function FileUploader({
  onUploadComplete,
  onUploadError,
}: FileUploaderProps) {
  return (
    <UploadDropzone
      endpoint="pdfUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]?.url) {
          onUploadComplete(res[0].url);
        }
      }}
      onUploadError={(error: Error) => {
        onUploadError(error);
      }}
      content={{
        label: "Drop PDF here or click to browse",
        allowedContent: "PDF files up to 16MB",
      }}
    />
  );
}
