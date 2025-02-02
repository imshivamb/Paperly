"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Highlight } from "@prisma/client";
import {
  ChevronLeft,
  ChevronRight,
  Highlighter,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
  paperId: string;
  initialHighlights?: Highlight[];
}

const HIGHLIGHT_COLORS = [
  { value: "#ffeb3b", label: "Yellow" },
  { value: "#4caf50", label: "Green" },
  { value: "#2196f3", label: "Blue" },
  { value: "#f44336", label: "Red" },
];

export function PDFViewer({
  pdfUrl,
  paperId,
  initialHighlights = [],
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(HIGHLIGHT_COLORS[0].value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle text selection for highlighting
  const handleTextSelection = async () => {
    if (!isHighlighting) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    // const range = selection.getRangeAt(0);
    const text = selection.toString();

    if (!text.trim()) return;

    try {
      const response = await fetch("/api/highlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          color: selectedColor,
          page: pageNumber,
          paperId,
        }),
      });

      if (!response.ok) throw new Error("Failed to save highlight");

      const newHighlight = await response.json();
      setHighlights([...highlights, newHighlight]);

      // Clear selection
      selection.removeAllRanges();
    } catch (error) {
      console.error("Error saving highlight:", error);
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
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
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isHighlighting ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => setIsHighlighting(!isHighlighting)}
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isHighlighting
                  ? "Disable highlighting"
                  : "Enable highlighting"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {isHighlighting && (
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {HIGHLIGHT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

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
      </div>

      <div
        ref={containerRef}
        className="relative max-h-[calc(100vh-200px)] overflow-auto border rounded-lg"
        onMouseUp={handleTextSelection}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center min-h-[500px]">
              Loading PDF...
            </div>
          }
          error={
            <div className="flex items-center justify-center min-h-[500px]">
              Failed to load PDF. Please try again later.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading={
              <div className="flex items-center justify-center min-h-[500px]">
                Loading page...
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
}
