"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Paperly
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your research papers
          </p>
        </div>
        <Button
          onClick={() => signIn("google", { callbackUrl: "/papers" })}
          variant="outline"
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
