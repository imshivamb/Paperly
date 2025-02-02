import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  PapersList,
  type PaperListItem,
} from "@/components/papers/papers-list";
import { PapersToolbar } from "@/components/papers/papers-toolbar";

export const metadata: Metadata = {
  title: "Recent Papers | Paperly",
  description: "View your recently added papers",
};

export default async function RecentPapersPage() {
  const session = await getServerSession(authOptions);

  const recentPapers = await prisma.paper.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    select: {
      id: true,
      title: true,
      authors: true,
      publicationDate: true,
      pdfUrl: true,
      isStarred: true,
      labels: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

  const mappedPapers: PaperListItem[] = recentPapers.map((paper) => ({
    id: paper.id,
    title: paper.title,
    authors: paper.authors,
    publicationDate: paper.publicationDate?.toISOString() ?? null,
    pdfUrl: paper.pdfUrl,
    isStarred: paper.isStarred,
    labels: paper.labels.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
    })),
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recently Added</h1>
          <p className="text-muted-foreground">
            Your most recently added papers
          </p>
        </div>
      </div>
      <PapersToolbar />
      <PapersList papers={mappedPapers} />
    </div>
  );
}
