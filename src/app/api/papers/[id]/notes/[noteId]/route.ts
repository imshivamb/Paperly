import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

interface RouteParams {
  params: Promise<{
    id: string
    noteId: string
  }>
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const note = await prisma.note.findFirst({
      where: {
        id: resolvedParams.noteId,
        paperId: resolvedParams.id,
        userId: session.user.id,
      },
    })

    if (!note) {
      return new NextResponse("Not found", { status: 404 })
    }

    const json = await req.json()
    const updatedNote = await prisma.note.update({
      where: {
        id: resolvedParams.noteId,
      },
      data: {
        content: json.content,
        pageNumber: json.pageNumber,
      },
    })

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error("Error updating note:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const note = await prisma.note.findFirst({
      where: {
        id: resolvedParams.noteId,
        paperId: resolvedParams.id,
        userId: session.user.id,
      },
    })

    if (!note) {
      return new NextResponse("Not found", { status: 404 })
    }

    await prisma.note.delete({
      where: {
        id: resolvedParams.noteId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting note:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}