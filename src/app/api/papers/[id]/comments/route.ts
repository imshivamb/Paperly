import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { Comment } from "@prisma/client"

interface RouteParams {
  params: {
    id: string
  }
}

// Store comment streams for real-time updates
const commentStreams = new Map<string, Set<(comment: Comment) => void>>()

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const comments = await prisma.comment.findMany({
      where: {
        paperId: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const comment = await prisma.comment.create({
      data: {
        content: json.content,
        paperId: params.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // Notify all connected clients about the new comment
    const listeners = commentStreams.get(params.id)
    if (listeners) {
      listeners.forEach(listener => listener(comment))
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}