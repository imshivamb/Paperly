"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string | null;
  pdfUrl: string | null;
  isStarred: boolean;
  labels: {
    id: string;
    name: string;
    color: string;
  }[];
}

export function PapersList() {
  const searchParams = useSearchParams();
  const [papers, setPapers] = React.useState<Paper[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const query = searchParams.get("query");
        const response = await fetch(
          `/api/papers${query ? `?query=${query}` : ""}`
        );
        if (!response.ok) throw new Error("Failed to fetch papers");
        const data = await response.json();
        setPapers(data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [searchParams]);

  const toggleStar = async (paperId: string) => {
    try {
      const paper = papers.find((p) => p.id === paperId);
      if (!paper) return;

      const response = await fetch(`/api/papers/${paperId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isStarred: !paper.isStarred }),
      });

      if (!response.ok) throw new Error("Failed to update paper");

      setPapers(
        papers.map((p) =>
          p.id === paperId ? { ...p, isStarred: !p.isStarred } : p
        )
      );
    } catch (error) {
      console.error("Error updating paper:", error);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (papers.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <p className="mt-2 text-sm text-muted-foreground">
            No papers found. Try different search terms or add a new paper.
          </p>
          <Button asChild className="mt-4">
            <Link href="/papers/upload">Add Paper</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Authors</TableHead>
          <TableHead>Labels</TableHead>
          <TableHead>Published</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {papers.map((paper) => (
          <TableRow key={paper.id}>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleStar(paper.id)}
              >
                <Star
                  className={
                    paper.isStarred
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }
                  size={16}
                />
              </Button>
            </TableCell>
            <TableCell>
              <Link
                href={`/papers/${paper.id}`}
                className="font-medium hover:underline"
              >
                {paper.title}
              </Link>
            </TableCell>
            <TableCell>{paper.authors.join(", ")}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {paper.labels.map((label) => (
                  <Badge
                    key={label.id}
                    style={{ backgroundColor: label.color }}
                    className="text-white"
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {paper.publicationDate
                ? new Date(paper.publicationDate).toLocaleDateString()
                : "N/A"}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {paper.pdfUrl && (
                    <DropdownMenuItem asChild>
                      <a
                        href={paper.pdfUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      // Handle delete - implement later
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
}
