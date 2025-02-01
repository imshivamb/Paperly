import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')

    const papers = await prisma.paper.findMany({
      where: {
        userId: session.user.id,
        OR: query ? [
          { title: { contains: query, mode: 'insensitive' } },
          { abstract: { contains: query, mode: 'insensitive' } },
          { authors: { hasSome: [query] } }
        ] : undefined
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        labels: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json(papers)
  } catch (error) {
    console.error("Error fetching papers:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const paper = await prisma.paper.create({
      data: {
        title: json.title,
        authors: json.authors,
        abstract: json.abstract,
        pdfUrl: json.pdfUrl,
        publicationDate: json.publicationDate ? new Date(json.publicationDate) : null,
        userId: session.user.id,
      },
      include: {
        labels: true
      }
    })

    return NextResponse.json(paper)
  } catch (error) {
    console.error("Error creating paper:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}