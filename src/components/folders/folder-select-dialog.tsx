"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { type FolderType } from "../folders/folders-list";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FolderSelectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paperId: string;
  currentFolders?: string[];
}

export function FolderSelectDialog({
  open,
  onOpenChange,
  paperId,
  currentFolders = [],
}: FolderSelectProps) {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/folders");
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = async (folderId: string) => {
    const isInFolder = currentFolders.includes(folderId);
    const method = isInFolder ? "DELETE" : "POST";

    try {
      const response = await fetch(`/api/folders/${folderId}/papers`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId }),
      });

      if (!response.ok) throw new Error("Failed to update folder");
      fetchFolders();
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Folders</DialogTitle>
          <DialogDescription>
            Select folders to add this paper to
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[300px] overflow-y-auto">
          <div className="grid gap-4 py-4">
            {folders.map((folder) => (
              <div key={folder.id} className="flex items-center space-x-3">
                <Input
                  type="checkbox"
                  id={folder.id}
                  className="h-4 w-4"
                  checked={currentFolders.includes(folder.id)}
                  onChange={() => toggleFolder(folder.id)}
                  disabled={loading}
                />
                <Label htmlFor={folder.id} className="cursor-pointer">
                  {folder.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
