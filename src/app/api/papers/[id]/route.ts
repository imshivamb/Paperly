import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"


// Get a single paper
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const paper = await prisma.paper.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!paper) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(paper)
  } catch (error) {
    console.error("Error fetching paper:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// Update a paper
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const paper = await prisma.paper.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!paper) {
      return new NextResponse("Not found", { status: 404 })
    }

    const updatedPaper = await prisma.paper.update({
      where: {
        id: params.id,
      },
      data: json,
    })

    return NextResponse.json(updatedPaper)
  } catch (error) {
    console.error("Error updating paper:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// Delete a paper
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const paper = await prisma.paper.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!paper) {
      return new NextResponse("Not found", { status: 404 })
    }

    await prisma.paper.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting paper:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}