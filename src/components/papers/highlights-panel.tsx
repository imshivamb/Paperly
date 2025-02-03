"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HighlightComments } from "./highlight-comments";
import type { Highlight } from "@prisma/client";
import { LoadingState } from "../ui/loading-state";

interface HighlightsPanelProps {
  paperId: string;
  onHighlightClick?: (highlight: Highlight) => void;
}

export function HighlightsPanel({
  paperId,
  onHighlightClick,
}: HighlightsPanelProps) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHighlights();
  }, [paperId]);

  const fetchHighlights = async () => {
    try {
      const response = await fetch(`/api/highlights?paperId=${paperId}`);
      if (!response.ok) throw new Error("Failed to fetch highlights");
      const data = await response.json();
      setHighlights(data);
    } catch (error) {
      console.error("Error fetching highlights:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSave = async (highlightId: string, comment: string) => {
    try {
      const response = await fetch(`/api/highlights/${highlightId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) throw new Error("Failed to update highlight");

      const updatedHighlight = await response.json();
      setHighlights(
        highlights.map((h) => (h.id === highlightId ? updatedHighlight : h))
      );
    } catch (error) {
      console.error("Error updating highlight:", error);
    }
  };

  const colorGroups = highlights.reduce((acc, highlight) => {
    if (!acc[highlight.color]) {
      acc[highlight.color] = [];
    }
    acc[highlight.color].push(highlight);
    return acc;
  }, {} as Record<string, Highlight[]>);

  if (loading)
    return (
      <div>
        <LoadingState />
      </div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Highlights & Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.keys(colorGroups).map((color) => (
              <TabsTrigger key={color} value={color} className="relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundColor: color }}
                />
                <span className="relative">{colorGroups[color].length}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[500px]">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="group relative mb-4 space-y-2 rounded-lg border p-4"
                  onClick={() => onHighlightClick?.(highlight)}
                >
                  <div
                    className="absolute inset-y-0 left-0 w-1 rounded-l-lg"
                    style={{ backgroundColor: highlight.color }}
                  />
                  <div className="pl-3">
                    <div className="text-sm">Page {highlight.page}</div>
                    <div className="mt-1">{highlight.text}</div>
                    <div className="mt-2">
                      <HighlightComments
                        highlight={highlight}
                        onSave={(comment) =>
                          handleCommentSave(highlight.id, comment)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          {Object.entries(colorGroups).map(([color, colorHighlights]) => (
            <TabsContent key={color} value={color}>
              <ScrollArea className="h-[500px]">
                {colorHighlights.map((highlight) => (
                  <div
                    key={highlight.id}
                    className="group relative mb-4 space-y-2 rounded-lg border p-4"
                    onClick={() => onHighlightClick?.(highlight)}
                  >
                    <div
                      className="absolute inset-y-0 left-0 w-1 rounded-l-lg"
                      style={{ backgroundColor: highlight.color }}
                    />
                    <div className="pl-3">
                      <div className="text-sm">Page {highlight.page}</div>
                      <div className="mt-1">{highlight.text}</div>
                      <div className="mt-2">
                        <HighlightComments
                          highlight={highlight}
                          onSave={(comment) =>
                            handleCommentSave(highlight.id, comment)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
