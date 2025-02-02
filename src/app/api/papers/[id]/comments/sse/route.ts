import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Comment } from "@prisma/client"
import { RouteParams, IdParam } from "@/types/routes"


const commentStreams = new Map<string, Set<(comment: Comment) => void>>()
export async function GET(req: Request, { params }: RouteParams<IdParam>) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue("data: connected\n\n")

        // Add this client to paper's comment stream
        const listeners = commentStreams.get(resolvedParams.id) || new Set()
        const listener = (comment: Comment) => {
          controller.enqueue(`data: ${JSON.stringify(comment)}\n\n`)
        }
        listeners.add(listener)
        commentStreams.set(resolvedParams.id, listeners)

        // Cleanup on close
        req.signal.addEventListener("abort", () => {
          const listeners = commentStreams.get(resolvedParams.id)
          if (listeners) {
            listeners.delete(listener)
            if (listeners.size === 0) {
              commentStreams.delete(resolvedParams.id)
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