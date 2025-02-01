"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Download, MoreVertical, Star, Trash } from "lucide-react";
import { Paper } from "@prisma/client";
import { useState } from "react";

interface PaperDetailHeaderProps {
  paper: Paper;
}

export function PaperDetailHeader({ paper }: PaperDetailHeaderProps) {
  const router = useRouter();
  const [isStarred, setIsStarred] = useState(paper.isStarred || false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this paper?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/papers/${paper.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete paper");

      router.push("/papers");
      router.refresh();
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };

  const toggleStar = async () => {
    try {
      const response = await fetch(`/api/papers/${paper.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !isStarred }),
      });

      if (!response.ok) throw new Error("Failed to update paper");

      setIsStarred(!isStarred);
      router.refresh();
    } catch (error) {
      console.error("Error updating paper:", error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{paper.title}</h1>
        <p className="text-muted-foreground">
          {paper.authors?.join(", ")}
          {paper.publicationDate &&
            ` • ${new Date(paper.publicationDate).getFullYear()}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleStar}>
          <Star
            className={isStarred ? "fill-yellow-400 text-yellow-400" : ""}
            size={20}
          />
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a
            href={paper.pdfUrl || ""}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={20} />
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
