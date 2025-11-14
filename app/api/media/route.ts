import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { filename, url, mimeType, size, width, height, alt } = body

    if (!filename || !url || !mimeType || !size) {
      return NextResponse.json(
        { error: 'Filename, URL, mimeType, and size are required' },
        { status: 400 }
      )
    }

    const media = await prisma.media.create({
      data: {
        filename,
        url,
        mimeType,
        size,
        width,
        height,
        alt,
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    )
  }
}

