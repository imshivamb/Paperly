import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const highlight = await prisma.highlight.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!highlight) {
      return new NextResponse("Not found", { status: 404 })
    }

    const json = await req.json()
    const updatedHighlight = await prisma.highlight.update({
      where: {
        id: params.id,
      },
      data: {
        comment: json.comment,
      },
    })

    return NextResponse.json(updatedHighlight)
  } catch (error) {
    console.error("Error updating highlight:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const highlight = await prisma.highlight.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!highlight) {
      return new NextResponse("Not found", { status: 404 })
    }

    await prisma.highlight.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting highlight:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}