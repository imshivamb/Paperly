"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tag, Circle } from "lucide-react";

const COLORS = [
  "#FF5733", // Red
  "#33FF57", // Green
  "#3357FF", // Blue
  "#FF33F5", // Pink
  "#33FFF5", // Cyan
  "#FFB833", // Orange
];

interface LabelCreateDialogProps {
  onLabelCreated?: () => void;
}

export function LabelCreateDialog({ onLabelCreated }: LabelCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) throw new Error("Failed to create label");

      setOpen(false);
      setName("");
      setColor(COLORS[0]);
      onLabelCreated?.();
    } catch (error) {
      console.error("Error creating label:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Tag className="h-4 w-4 mr-2" />
          New Label
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Label</DialogTitle>
          <DialogDescription>
            Create a new label to categorize your papers
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              placeholder="Label name"
              className="col-span-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {COLORS.map((c) => (
              <Button
                key={c}
                type="button"
                variant="ghost"
                className={`p-2 ${color === c ? "ring-2 ring-offset-2" : ""}`}
                onClick={() => setColor(c)}
              >
                <Circle className="h-6 w-6" style={{ color: c }} fill={c} />
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating || !name.trim()}>
            {isCreating ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
