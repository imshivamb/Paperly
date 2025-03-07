import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { RouteParams, IdParam } from "@/types/routes"

export async function POST(req: Request, { params }: RouteParams<IdParam>) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const paper = await prisma.paper.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
    })

    if (!paper) {
      return new NextResponse("Paper not found", { status: 404 })
    }

    const { folderId } = await req.json()

    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId: session.user.id,
      },
    })

    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 })
    }

    // Update paper's folders
    await prisma.paper.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        folders: {
          connect: {
            id: folderId,
          },
        },
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error moving paper:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}