import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contentTypes = await prisma.contentType.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })
    return NextResponse.json(contentTypes)
  } catch (error) {
    console.error('Error fetching content types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content types' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, fields, config } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingContentType = await prisma.contentType.findUnique({
      where: { slug },
    })

    if (existingContentType) {
      return NextResponse.json(
        { error: 'A content type with this slug already exists' },
        { status: 400 }
      )
    }

    // Check if name already exists
    const existingName = await prisma.contentType.findUnique({
      where: { name },
    })

    if (existingName) {
      return NextResponse.json(
        { error: 'A content type with this name already exists' },
        { status: 400 }
      )
    }

    const contentType = await prisma.contentType.create({
      data: {
        name,
        slug,
        description,
        fields: fields || null,
        config: config || null,
      },
    })

    return NextResponse.json(contentType, { status: 201 })
  } catch (error) {
    console.error('Error creating content type:', error)
    return NextResponse.json(
      { error: 'Failed to create content type' },
      { status: 500 }
    )
  }
}

