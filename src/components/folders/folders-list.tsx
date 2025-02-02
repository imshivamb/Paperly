"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Folder, Loader2, MoreHorizontal, Edit, Trash } from "lucide-react";
import { FolderCreateDialog } from "./folder-create-dialog";
import { Paper } from "@/types";

interface FolderType {
  id: string;
  name: string;
  createdAt: string;
  papers: Paper[];
  _count?: {
    papers: number;
  };
}

interface FoldersListProps {
  initialFolders?: FolderType[];
  isShared?: boolean;
}

export function FoldersList({
  initialFolders,
  isShared = false,
}: FoldersListProps) {
  const [folders, setFolders] = useState<FolderType[]>(initialFolders || []);
  const [loading, setLoading] = useState(!initialFolders);

  const fetchFolders = async () => {
    if (initialFolders) {
      setFolders(initialFolders);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/folders");
      if (!response.ok) throw new Error("Failed to fetch folders");
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [initialFolders]);

  const handleDelete = async (folderId: string) => {
    if (isShared) return; // Prevent deletion of shared folders

    const confirmed = window.confirm(
      "Are you sure you want to delete this folder?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete folder");

      setFolders(folders.filter((folder) => folder.id !== folderId));
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">
            {isShared ? "Shared Folders" : "Folders"}
          </h2>
          <p className="text-muted-foreground">
            Organize your papers into folders
          </p>
        </div>
        {!isShared && <FolderCreateDialog onFolderCreated={fetchFolders} />}
      </div>

      {folders.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <Folder className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No folders</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            {isShared
              ? "No folders have been shared with you."
              : "Create folders to organize your papers."}
          </p>
          {!isShared && <FolderCreateDialog onFolderCreated={fetchFolders} />}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Papers</TableHead>
              <TableHead>Created</TableHead>
              {!isShared && <TableHead className="w-[70px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {folders.map((folder) => (
              <TableRow key={folder.id}>
                <TableCell className="font-medium">{folder.name}</TableCell>
                <TableCell>
                  {folder._count?.papers || folder.papers?.length || 0}
                </TableCell>
                <TableCell>
                  {new Date(folder.createdAt).toDateString()}
                </TableCell>
                {!isShared && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            // Implement edit functionality
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(folder.id)}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
