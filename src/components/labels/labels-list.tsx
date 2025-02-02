"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Circle, Loader2, MoreHorizontal, Edit, Trash } from "lucide-react";
import { LabelCreateDialog } from "./label-create-dialog";

interface Label {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  _count: {
    papers: number;
  };
}

export function LabelsList() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLabels = async () => {
    try {
      const response = await fetch("/api/labels");
      if (!response.ok) throw new Error("Failed to fetch labels");
      const data = await response.json();
      setLabels(data);
    } catch (error) {
      console.error("Error fetching labels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const handleDelete = async (labelId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this label?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/labels/${labelId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete label");

      setLabels(labels.filter((label) => label.id !== labelId));
    } catch (error) {
      console.error("Error deleting label:", error);
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
        <h2 className="text-2xl font-bold tracking-tight">Labels</h2>
        <LabelCreateDialog onLabelCreated={fetchLabels} />
      </div>

      {labels.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <Circle className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No labels</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Create labels to categorize your papers.
          </p>
          <LabelCreateDialog onLabelCreated={fetchLabels} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Papers</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labels.map((label) => (
              <TableRow key={label.id}>
                <TableCell>
                  <Circle
                    className="h-4 w-4"
                    fill={label.color}
                    color={label.color}
                  />
                </TableCell>
                <TableCell className="font-medium">{label.name}</TableCell>
                <TableCell>{label._count.papers}</TableCell>
                <TableCell>
                  {new Date(label.createdAt).toLocaleDateString()}
                </TableCell>
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
                        onClick={() => handleDelete(label.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
