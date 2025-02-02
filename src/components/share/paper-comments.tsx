"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface PaperCommentsProps {
  paperId: string;
}

export function PaperComments({ paperId }: PaperCommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    // Set up SSE connection for real-time updates
    const events = new EventSource(`/api/papers/${paperId}/comments/sse`);

    events.onmessage = (event) => {
      const comment = JSON.parse(event.data);
      setComments((prev) => [comment, ...prev]);
    };

    return () => {
      events.close();
    };
  }, [paperId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/papers/${paperId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/papers/${paperId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    if (email) return email[0].toUpperCase();
    return "?";
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
          disabled={!session}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !newComment.trim() || !session}
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={comment.user.image || undefined} />
                <AvatarFallback>
                  {getInitials(comment.user.name, comment.user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {comment.user.name || comment.user.email}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
