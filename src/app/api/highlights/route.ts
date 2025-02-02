import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const highlight = await prisma.highlight.create({
      data: {
        text: json.text,
        color: json.color,
        page: json.page,
        paperId: json.paperId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(highlight)
  } catch (error) {
    console.error("Error creating highlight:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const paperId = searchParams.get('paperId')

    if (!paperId) {
      return new NextResponse("Paper ID is required", { status: 400 })
    }

    const highlights = await prisma.highlight.findMany({
      where: {
        paperId,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(highlights)
  } catch (error) {
    console.error("Error fetching highlights:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}