import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionType = await prisma.sessionType.findUnique({
      where: { id },
    })

    if (!sessionType) {
      return NextResponse.json(
        { error: 'Session type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sessionType)
  } catch (error) {
    console.error('Error fetching session type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session type' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, description, duration, config } = body

    // Check if session type exists
    const existingSessionType = await prisma.sessionType.findUnique({
      where: { id },
    })

    if (!existingSessionType) {
      return NextResponse.json(
        { error: 'Session type not found' },
        { status: 404 }
      )
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== existingSessionType.slug) {
      const slugConflict = await prisma.sessionType.findUnique({
        where: { slug },
      })
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A session type with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== existingSessionType.name) {
      const nameConflict = await prisma.sessionType.findUnique({
        where: { name },
      })
      if (nameConflict) {
        return NextResponse.json(
          { error: 'A session type with this name already exists' },
          { status: 400 }
        )
      }
    }

    const sessionType = await prisma.sessionType.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(duration !== undefined && { duration }),
        ...(config !== undefined && { config }),
      },
    })

    return NextResponse.json(sessionType)
  } catch (error) {
    console.error('Error updating session type:', error)
    return NextResponse.json(
      { error: 'Failed to update session type' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const sessionType = await prisma.sessionType.findUnique({
      where: { id },
    })

    if (!sessionType) {
      return NextResponse.json(
        { error: 'Session type not found' },
        { status: 404 }
      )
    }

    await prisma.sessionType.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Session type deleted successfully' })
  } catch (error) {
    console.error('Error deleting session type:', error)
    return NextResponse.json(
      { error: 'Failed to delete session type' },
      { status: 500 }
    )
  }
}

