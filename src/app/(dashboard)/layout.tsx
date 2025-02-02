"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardNav } from "@/components/layouts/dashboard-nav";
import { SideNav } from "@/components/layouts/app-sidebar";
import { LoadingState } from "@/components/ui/loading-state";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <LoadingState />
      </>
    );
  }

  return (
    <>
      <DashboardNav />
      <div className="flex min-h-screen flex-col">
        <div className="container flex-1 items-start md:grid md:grid-cols-[260px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
          <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <SideNav />
          </aside>
          <main className="flex w-full flex-col mt-8 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
