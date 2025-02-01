import { Metadata } from "next";
import { PaperUploadForm } from "@/components/papers/paper-upload-form";

export const metadata: Metadata = {
  title: "Upload Paper | Paperly",
  description: "Upload a new research paper",
};

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Upload Paper</h3>
          <p className="text-sm text-muted-foreground">
            Upload a new research paper to your library
          </p>
        </div>
        <PaperUploadForm />
      </div>
    </div>
  );
}
