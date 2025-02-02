"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  FolderClosed,
  Share2,
  Star,
  Clock,
  ChevronRight,
  ChevronDown,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderCreateDialog } from "@/components/folders/folder-create-dialog";
import { LabelCreateDialog } from "@/components/labels/label-create-dialog";

interface SideNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SideNav({ className }: SideNavProps) {
  const pathname = usePathname();
  const [showFolders, setShowFolders] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <ScrollArea className="h-full py-6">
      <nav className={cn("px-4 space-y-6", className)}>
        {/* Library Section */}
        <div className="space-y-1">
          <h2 className="px-2 text-lg font-semibold tracking-tight">Library</h2>
          <div className="space-y-1">
            <Link href="/papers">
              <Button
                variant={pathname === "/papers" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-4 w-4" />
                All Papers
              </Button>
            </Link>
            <Link href="/papers/recent">
              <Button
                variant={pathname === "/papers/recent" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Clock className="mr-2 h-4 w-4" />
                Recently Added
              </Button>
            </Link>
            <Link href="/papers/starred">
              <Button
                variant={pathname === "/papers/starred" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Star className="mr-2 h-4 w-4" />
                Starred
              </Button>
            </Link>
          </div>
        </div>

        {/* Folders Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="px-2 text-lg font-semibold tracking-tight">
              Folders
            </h2>
            <div className="flex items-center gap-2">
              <FolderCreateDialog />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowFolders(!showFolders)}
              >
                {showFolders ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {showFolders && (
            <div className="space-y-1">
              <Link href="/folders">
                <Button
                  variant={pathname === "/folders" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <FolderClosed className="mr-2 h-4 w-4" />
                  All Folders
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Labels Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="px-2 text-lg font-semibold tracking-tight">
              Labels
            </h2>
            <div className="flex items-center gap-2">
              <LabelCreateDialog />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowLabels(!showLabels)}
              >
                {showLabels ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {showLabels && (
            <div className="space-y-1">
              <Link href="/labels">
                <Button
                  variant={pathname === "/labels" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Tag className="mr-2 h-4 w-4" />
                  All Labels
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Shared Section */}
        <div className="space-y-2">
          <h2 className="px-2 text-lg font-semibold tracking-tight">Shared</h2>
          <div className="space-y-1">
            <Link href="/shared">
              <Button
                variant={pathname === "/shared" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Shared with me
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </ScrollArea>
  );
}
