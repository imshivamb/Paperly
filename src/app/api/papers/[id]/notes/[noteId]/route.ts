import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"


export async function PATCH(req: Request, { params }: {params: {
    id: string
    noteId: string}
  }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const note = await prisma.note.findFirst({
      where: {
        id: params.noteId,
        paperId: params.id,
        userId: session.user.id,
      },
    })

    if (!note) {
      return new NextResponse("Not found", { status: 404 })
    }

    const json = await req.json()
    const updatedNote = await prisma.note.update({
      where: {
        id: params.noteId,
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

export async function DELETE(req: Request, { params }: {params: {
  id: string
  noteId: string}
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const note = await prisma.note.findFirst({
      where: {
        id: params.noteId,
        paperId: params.id,
        userId: session.user.id,
      },
    })

    if (!note) {
      return new NextResponse("Not found", { status: 404 })
    }

    await prisma.note.delete({
      where: {
        id: params.noteId,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting note:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}