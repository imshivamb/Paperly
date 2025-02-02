"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { Folder as FolderType, Label, Paper } from "@prisma/client";
import { Folder, Star } from "lucide-react";

interface DragAndDropPapersProps {
  papers: (Paper & {
    labels: Label[];
  })[];
  folders: FolderType[];
  onPaperMoved: () => void;
}

export function DragAndDropPapers({
  papers,
  folders,
  onPaperMoved,
}: DragAndDropPapersProps) {
  const handleDragEnd = async (result: any) => {
    if (!result.destination || !result.draggableId) return;

    const paperId = result.draggableId;
    const folderId = result.destination.droppableId;

    try {
      const response = await fetch(`/api/papers/${paperId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId }),
      });

      if (!response.ok) throw new Error("Failed to move paper");

      onPaperMoved();
    } catch (error) {
      console.error("Error moving paper:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <Droppable droppableId="papers">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {papers.map((paper, index) => (
                  <Draggable
                    key={paper.id}
                    draggableId={paper.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card>
                          <CardHeader className="flex flex-row items-start justify-between space-y-0">
                            <div>
                              <CardTitle>{paper.title}</CardTitle>
                              <CardDescription>
                                {paper.authors.join(", ")}
                              </CardDescription>
                            </div>
                            {paper.isStarred && (
                              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
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
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div className="space-y-4">
          {folders.map((folder) => (
            <Droppable key={folder.id} droppableId={folder.id}>
              {(provided, snapshot) => (
                <Card
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${
                    snapshot.isDraggingOver ? "border-primary" : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      {folder.name}
                    </CardTitle>
                  </CardHeader>
                  {provided.placeholder}
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}
