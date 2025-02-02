"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share, Link, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareFolderDialogProps {
  folderId: string;
  folderName: string;
}

export function ShareFolderDialog({
  folderId,
  folderName,
}: ShareFolderDialogProps) {
  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateShareLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/folders/${folderId}/share`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to generate share link");

      const data = await response.json();
      const link = `${window.location.origin}/shared/${data.shareLink}`;
      setShareLink(link);
    } catch (error) {
      console.error("Error generating share link:", error);
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Success",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Folder</DialogTitle>
          <DialogDescription>
            Share &quot;{folderName}&quot; with others
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          <TabsContent value="link" className="space-y-4">
            {!shareLink ? (
              <Button
                onClick={generateShareLink}
                disabled={loading}
                className="w-full"
              >
                <Link className="h-4 w-4 mr-2" />
                Generate Share Link
              </Button>
            ) : (
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly />
                  <Button onClick={copyToClipboard} variant="outline">
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="Enter email address" />
              <Button className="w-full">Share via Email</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
