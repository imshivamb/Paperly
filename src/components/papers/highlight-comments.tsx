"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Save, X } from "lucide-react";
import type { Highlight } from "@prisma/client";

interface HighlightCommentsProps {
  highlight: Highlight;
  onSave: (comment: string) => Promise<void>;
}

export function HighlightComments({
  highlight,
  onSave,
}: HighlightCommentsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(highlight.comment || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(comment);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving comment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing && !highlight.comment) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-2"
        onClick={() => setIsEditing(true)}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="ml-2">Add Comment</span>
      </Button>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <ScrollArea className="h-24 w-full rounded-md border">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment..."
              className="border-0"
            />
          </ScrollArea>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setComment(highlight.comment || "");
              setIsEditing(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="text-sm text-muted-foreground">{highlight.comment}</div>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </Button>
    </div>
  );
}
