import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { RouteParams, IdParam } from "@/types/routes"

export async function GET(req: Request, { params }: RouteParams<IdParam>) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const notes = await prisma.note.findMany({
      where: {
        paperId: resolvedParams.id,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request, { params }: RouteParams<IdParam>) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const note = await prisma.note.create({
      data: {
        content: json.content,
        pageNumber: json.pageNumber,
        paperId: resolvedParams.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error creating note:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}