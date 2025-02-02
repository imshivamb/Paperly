import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const labels = await prisma.label.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            papers: true,
          },
        },
      },
    })

    return NextResponse.json(labels)
  } catch (error) {
    console.error("Error fetching labels:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const label = await prisma.label.create({
      data: {
        name: json.name,
        color: json.color,
        userId: session.user.id,
      },
    })

    return NextResponse.json(label)
  } catch (error) {
    console.error("Error creating label:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}