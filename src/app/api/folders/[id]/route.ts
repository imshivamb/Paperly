import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const folder = await prisma.folder.findFirst({
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

    if (!folder) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(folder)
  } catch (error) {
    console.error("Error fetching folder:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const folder = await prisma.folder.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!folder) {
      return new NextResponse("Not found", { status: 404 })
    }

    const json = await req.json()
    const updatedFolder = await prisma.folder.update({
      where: {
        id: params.id,
      },
      data: {
        name: json.name,
      },
    })

    return NextResponse.json(updatedFolder)
  } catch (error) {
    console.error("Error updating folder:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const folder = await prisma.folder.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!folder) {
      return new NextResponse("Not found", { status: 404 })
    }

    await prisma.folder.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting folder:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}