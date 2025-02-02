"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, File, Folder, Share2, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <File className="h-6 w-6" />,
      title: "Smart Paper Management",
      description:
        "Organize your research papers with powerful search, tags, and folders.",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description:
        "Get instant summaries, key findings, and research gap analysis.",
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Seamless Collaboration",
      description:
        "Share papers, collaborate with comments, and work together in real-time.",
    },
    {
      icon: <Folder className="h-6 w-6" />,
      title: "Efficient Organization",
      description:
        "Keep your research organized with folders, labels, and smart filters.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 mx-auto w-full flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Paperly</span>
          </Link>
          <nav className="flex items-center gap-4">
            {session ? (
              <Button asChild>
                <Link href="/papers">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4">
        {/* Hero Section */}
        <section className="container space-y-6 py-24 md:py-32">
          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Your Research.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Organized.
              </span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Manage, analyze, and collaborate on research papers with
              AI-powered insights. Say goodbye to chaotic research management.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
              Key Features
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to manage your research papers effectively.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-lg border bg-background p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t">
          <div className="container py-24">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">
                Ready to Transform Your Research?
              </h2>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                Join thousands of researchers who have already improved their
                workflow with Paperly.
              </p>
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto w-full flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/imshivamb"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Shivam Bhardwaj
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/imshivamb/Paperly"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline underline-offset-4"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
