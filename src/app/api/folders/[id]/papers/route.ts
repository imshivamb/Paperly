import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    const { paperId } = await req.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.folder.update({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
      data: {
        papers: {
          connect: { id: paperId }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding paper to folder:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    const { paperId } = await req.json()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.folder.update({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
      data: {
        papers: {
          disconnect: { id: paperId }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding paper to folder:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}