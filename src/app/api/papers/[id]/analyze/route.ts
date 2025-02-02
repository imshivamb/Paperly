import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { analyzePaper } from "@/lib/openai"


export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get the paper text from request body
    const { text } = await req.json()
    
    if (!text) {
      return new NextResponse("Paper text is required", { status: 400 })
    }

    // Get the paper to verify ownership
    const paper = await prisma.paper.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 })
    }

    // Analyze the paper
    const analysis = await analyzePaper(text)
    const { summary, keyFindings, gaps } = analysis

    // Update the paper with AI analysis
    const updatedPaper = await prisma.paper.update({
      where: { id: params.id },
      data: {
        aiSummary: summary,
        aiKeyFindings: keyFindings,
        aiGaps: gaps,
        analyzedAt: new Date(),
      },
    })

    return NextResponse.json(updatedPaper)
  } catch (error) {
    console.error("Error analyzing paper:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}