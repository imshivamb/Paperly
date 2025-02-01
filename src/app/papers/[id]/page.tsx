import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { PaperDetailHeader } from "@/components/papers/paper-detail-header";
import { PaperViewer } from "@/components/papers/paper-viewer";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const paper = await prisma.paper.findFirst({
    where: {
      id: params.id,
      userId: session?.user?.id,
    },
  });

  if (!paper) return { title: "Paper Not Found" };

  return {
    title: `${paper.title} | Paperly`,
    description: paper.abstract || "View paper details",
  };
}

export default async function PaperPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const paper = await prisma.paper.findFirst({
    where: {
      id: params.id,
      userId: session?.user?.id,
    },
  });

  if (!paper) notFound();

  return (
    <div className="flex flex-col gap-6">
      <PaperDetailHeader paper={paper} />
      <PaperViewer pdfUrl={paper.pdfUrl || ""} />
    </div>
  );
}
