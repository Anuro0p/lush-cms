import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sectionTypes = await prisma.sectionTypeDefinition.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })
    return NextResponse.json(sectionTypes)
  } catch (error) {
    console.error('Error fetching section types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section types' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, icon, component, fields, config, isActive } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingSectionType = await prisma.sectionTypeDefinition.findUnique({
      where: { slug },
    })

    if (existingSectionType) {
      return NextResponse.json(
        { error: 'A section type with this slug already exists' },
        { status: 400 }
      )
    }

    // Check if name already exists
    const existingName = await prisma.sectionTypeDefinition.findUnique({
      where: { name },
    })

    if (existingName) {
      return NextResponse.json(
        { error: 'A section type with this name already exists' },
        { status: 400 }
      )
    }

    const sectionType = await prisma.sectionTypeDefinition.create({
      data: {
        name,
        slug,
        description,
        icon: icon || null,
        component: component || null,
        fields: fields || null,
        config: config || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(sectionType, { status: 201 })
  } catch (error) {
    console.error('Error creating section type:', error)
    return NextResponse.json(
      { error: 'Failed to create section type' },
      { status: 500 }
    )
  }
}

