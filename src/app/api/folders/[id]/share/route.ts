import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { nanoid } from 'nanoid'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const folder = await prisma.folder.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id,
      },
    })

    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 })
    }

    // Check if a shared folder already exists
    let sharedFolder = await prisma.sharedFolder.findFirst({
      where: {
        ownerId: session.user.id,
        name: folder.name,
      },
    })

    if (!sharedFolder) {
      // Create a new shared folder
      sharedFolder = await prisma.sharedFolder.create({
        data: {
          name: folder.name,
          ownerId: session.user.id,
          shareLink: nanoid(10),
          papers: {
            connect: folder.papers.map(paper => ({ id: paper.id })),
          },
        },
      })
    }

    return NextResponse.json({
      shareLink: sharedFolder.shareLink,
    })
  } catch (error) {
    console.error("Error sharing folder:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}