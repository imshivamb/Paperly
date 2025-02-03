import { HighlightsPanel } from "@/components/papers/highlights-panel";
import { PaperDetailHeader } from "@/components/papers/paper-detail-header";
import { PaperNotes } from "@/components/papers/paper-notes";
import { PaperViewer } from "@/components/papers/paper-viewer";
import { PDFAnalysis } from "@/components/papers/pdf-analysis";
import { PaperComments } from "@/components/share/paper-comments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ExtendedPaper } from "@/types/paper";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

interface PageProps {
  params: Params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  const paper = await prisma.paper.findFirst({
    where: {
      id: resolvedParams.id,
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
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  const paper = (await prisma.paper.findFirst({
    where: {
      id: resolvedParams.id,
      userId: session?.user?.id,
    },
    include: {
      labels: true,
      highlights: true,
      notes: true,
    },
  })) as ExtendedPaper | null;

  if (!paper) notFound();

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="border-b">
        <div className="container py-4">
          <PaperDetailHeader paper={paper} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container grid grid-cols-[1fr,400px] gap-6 py-6">
        {/* Left Side - PDF Viewer */}
        <div className="flex flex-col overflow-hidden rounded-lg border bg-card pt-2">
          <PaperViewer pdfUrl={paper.pdfUrl || ""} />
        </div>

        {/* Right Side - Details & Tools */}
        <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
          <Tabs defaultValue="highlights" className="flex-1">
            <TabsList className="w-full justify-start h-12 px-4 border-b rounded-none">
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="highlights" className="m-0 p-0 h-full">
                <HighlightsPanel paperId={resolvedParams.id} />
              </TabsContent>

              <TabsContent value="analysis" className="m-0 p-4">
                <PDFAnalysis paper={paper} />
              </TabsContent>

              <TabsContent value="notes" className="m-0 p-4">
                <PaperNotes paperId={resolvedParams.id} currentPage={1} />
              </TabsContent>

              <TabsContent value="comments" className="m-0 p-4">
                <PaperComments paperId={resolvedParams.id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
