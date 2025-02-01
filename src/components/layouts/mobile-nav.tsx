"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex flex-col space-y-4">
          <Link
            href="/papers"
            className="hover:text-foreground/80"
            onClick={() => setOpen(false)}
          >
            Papers
          </Link>
          <Link
            href="/folders"
            className="hover:text-foreground/80"
            onClick={() => setOpen(false)}
          >
            Folders
          </Link>
          <Link
            href="/shared"
            className="hover:text-foreground/80"
            onClick={() => setOpen(false)}
          >
            Shared
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
