import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const contentType = await prisma.contentType.findUnique({
      where: { id },
    })

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(contentType)
  } catch (error) {
    console.error('Error fetching content type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content type' },
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
    const { name, slug, description, fields, config } = body

    // Check if content type exists
    const existingContentType = await prisma.contentType.findUnique({
      where: { id },
    })

    if (!existingContentType) {
      return NextResponse.json(
        { error: 'Content type not found' },
        { status: 404 }
      )
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== existingContentType.slug) {
      const slugConflict = await prisma.contentType.findUnique({
        where: { slug },
      })
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A content type with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== existingContentType.name) {
      const nameConflict = await prisma.contentType.findUnique({
        where: { name },
      })
      if (nameConflict) {
        return NextResponse.json(
          { error: 'A content type with this name already exists' },
          { status: 400 }
        )
      }
    }

    const contentType = await prisma.contentType.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(fields !== undefined && { fields }),
        ...(config !== undefined && { config }),
      },
    })

    return NextResponse.json(contentType)
  } catch (error) {
    console.error('Error updating content type:', error)
    return NextResponse.json(
      { error: 'Failed to update content type' },
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

    const contentType = await prisma.contentType.findUnique({
      where: { id },
    })

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type not found' },
        { status: 404 }
      )
    }

    await prisma.contentType.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Content type deleted successfully' })
  } catch (error) {
    console.error('Error deleting content type:', error)
    return NextResponse.json(
      { error: 'Failed to delete content type' },
      { status: 500 }
    )
  }
}

