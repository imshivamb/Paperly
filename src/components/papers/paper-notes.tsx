"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Note {
  id: string;
  content: string;
  pageNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaperNotesProps {
  paperId: string;
  currentPage?: number;
}

export function PaperNotes({ paperId, currentPage }: PaperNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [paperId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/papers/${paperId}/notes`);
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!newNoteContent.trim()) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/papers/${paperId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newNoteContent,
          pageNumber: currentPage,
        }),
      });

      if (!response.ok) throw new Error("Failed to save note");

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setNewNoteContent("");
      setIsAddingNote(false);
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/papers/${paperId}/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notes</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingNote(true)}
          disabled={isAddingNote}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isAddingNote && (
            <div className="mb-4 space-y-2">
              <Textarea
                placeholder="Add your note..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNewNoteContent("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveNote}
                  disabled={isSaving || !newNoteContent.trim()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="relative rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {note.pageNumber
                      ? `Page ${note.pageNumber}`
                      : "General note"}
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(note.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="text-sm">{note.content}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
