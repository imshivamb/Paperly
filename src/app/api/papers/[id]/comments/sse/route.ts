import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Comment } from "@prisma/client"

interface RouteParams {
  params: {
    id: string
  }
}
const commentStreams = new Map<string, Set<(comment: Comment) => void>>()
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue("data: connected\n\n")

        // Add this client to paper's comment stream
        const listeners = commentStreams.get(params.id) || new Set()
        const listener = (comment: Comment) => {
          controller.enqueue(`data: ${JSON.stringify(comment)}\n\n`)
        }
        listeners.add(listener)
        commentStreams.set(params.id, listeners)

        // Cleanup on close
        req.signal.addEventListener("abort", () => {
          const listeners = commentStreams.get(params.id)
          if (listeners) {
            listeners.delete(listener)
            if (listeners.size === 0) {
              commentStreams.delete(params.id)
            }
          }
        })
      }
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error setting up SSE:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}