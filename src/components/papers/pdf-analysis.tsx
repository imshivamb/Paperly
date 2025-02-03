"use client";

import { useState, useEffect } from "react";
import { extractPdfText } from "@/lib/pdf-utils";
import { PaperAnalysis } from "@/components/papers/paper-analysis";
import { ExtendedPaper } from "@/types/paper";

interface PDFAnalysisProps {
  paper: ExtendedPaper;
}

export function PDFAnalysis({ paper }: PDFAnalysisProps) {
  const [pdfText, setPdfText] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPdfText() {
      if (paper.pdfUrl) {
        try {
          const text = await extractPdfText(paper.pdfUrl);
          setPdfText(text);
        } catch (error) {
          console.error("Error loading PDF text:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    loadPdfText();
  }, [paper.pdfUrl]);

  if (isLoading) {
    return <div>Loading text analysis...</div>;
  }

  return <PaperAnalysis paper={paper} pdfText={pdfText} />;
}
