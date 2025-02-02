import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { Resend } from 'resend'
import { nanoid } from "nanoid"

const resend = new Resend(process.env.RESEND_API_KEY)

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { email } = await req.json()
    if (!email) {
      return new NextResponse("Email is required", { status: 400 })
    }

    const folder = await prisma.folder.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!folder) {
      return new NextResponse("Folder not found", { status: 404 })
    }

    // Get or create shared folder
    let sharedFolder = await prisma.sharedFolder.findFirst({
      where: {
        ownerId: session.user.id,
        name: folder.name,
      },
    })

    if (!sharedFolder) {
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

    // Send email using Resend
    await resend.emails.send({
      from: 'Paperly <papers@yourdomain.com>',
      to: email,
      subject: `${session.user.name || 'Someone'} shared a folder with you: ${folder.name}`,
      html: `
        <h2>Shared Folder: ${folder.name}</h2>
        <p>${session.user.name || 'Someone'} has shared a folder with you on Paperly.</p>
        <p>Click the link below to view the shared folder:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/shared/${sharedFolder.shareLink}">
          View Shared Folder
        </a>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sharing folder via email:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}