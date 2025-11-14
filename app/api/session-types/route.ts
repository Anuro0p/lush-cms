import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sessionTypes = await prisma.sessionType.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })
    return NextResponse.json(sessionTypes)
  } catch (error) {
    console.error('Error fetching session types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session types' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, duration, config } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingSessionType = await prisma.sessionType.findUnique({
      where: { slug },
    })

    if (existingSessionType) {
      return NextResponse.json(
        { error: 'A session type with this slug already exists' },
        { status: 400 }
      )
    }

    // Check if name already exists
    const existingName = await prisma.sessionType.findUnique({
      where: { name },
    })

    if (existingName) {
      return NextResponse.json(
        { error: 'A session type with this name already exists' },
        { status: 400 }
      )
    }

    const sessionType = await prisma.sessionType.create({
      data: {
        name,
        slug,
        description,
        duration: duration || null,
        config: config || null,
      },
    })

    return NextResponse.json(sessionType, { status: 201 })
  } catch (error) {
    console.error('Error creating session type:', error)
    return NextResponse.json(
      { error: 'Failed to create session type' },
      { status: 500 }
    )
  }
}

