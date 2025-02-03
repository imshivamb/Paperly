"use client";

import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "@/lib/pdf-config";
import { LoadingState } from "../ui/loading-state";

interface PaperViewerProps {
  pdfUrl: string;
}

export function PaperViewer({ pdfUrl }: PaperViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    console.log("PDF loaded successfully with", numPages, "pages");
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  }

  function changeScale(delta: number) {
    setScale((prevScale) => {
      const newScale = prevScale + delta;
      return Math.min(Math.max(0.5, newScale), 2.0);
    });
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        Loading viewer...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[100px] text-center">
          Page {pageNumber} of {numPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="mx-2 h-6 w-px bg-border" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeScale(-0.1)}
          disabled={scale <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeScale(0.1)}
          disabled={scale >= 2.0}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-auto border rounded-lg p-4 w-full">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center min-h-[500px]">
              <LoadingState />
            </div>
          }
          error={
            <div className="flex items-center justify-center min-h-[500px] text-destructive">
              Failed to load PDF. Please try again later.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading={
              <div className="flex items-center justify-center min-h-[500px]">
                <LoadingState />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}
