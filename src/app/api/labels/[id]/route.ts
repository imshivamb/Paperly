import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const label = await prisma.label.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        papers: true,
        _count: {
          select: {
            papers: true,
          },
        },
      },
    })

    if (!label) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(label)
  } catch (error) {
    console.error("Error fetching label:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const label = await prisma.label.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!label) {
      return new NextResponse("Not found", { status: 404 })
    }

    const json = await req.json()
    const updatedLabel = await prisma.label.update({
      where: {
        id: params.id,
      },
      data: {
        name: json.name,
        color: json.color,
      },
    })

    return NextResponse.json(updatedLabel)
  } catch (error) {
    console.error("Error updating label:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const label = await prisma.label.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!label) {
      return new NextResponse("Not found", { status: 404 })
    }

    await prisma.label.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting label:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}