import Link from "next/link";
import { UserNav } from "./user-nav";
import { MobileNav } from "./mobile-nav";

export function DashboardNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto w-full flex h-14 items-center">
        <MobileNav />
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Paperly</span>
          </Link>
        </div>
        <div>
          <nav className="md:flex hidden items-center space-x-6 ml-12 text-sm font-medium">
            <Link
              href="/papers"
              className="transition-colors hover:text-foreground/80"
            >
              Papers
            </Link>
            <Link
              href="/folders"
              className="transition-colors hover:text-foreground/80"
            >
              Folders
            </Link>
            <Link
              href="/shared"
              className="transition-colors hover:text-foreground/80"
            >
              Shared
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search later */}
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
