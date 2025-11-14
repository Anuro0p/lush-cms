import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sectionType = await prisma.sectionTypeDefinition.findUnique({
      where: { id },
    })

    if (!sectionType) {
      return NextResponse.json(
        { error: 'Section type not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sectionType)
  } catch (error) {
    console.error('Error fetching section type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section type' },
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
    const { name, slug, description, icon, component, fields, config, isActive } = body

    // Built-in section types that cannot have their slug changed
    const BUILT_IN_TYPES = [
      'HEADER',
      'HERO',
      'FEATURES',
      'TESTIMONIALS',
      'PRICING',
      'CTA',
      'CONTENT',
      'GALLERY',
      'FAQ',
      'TEAM',
      'STATS',
      'FOOTER',
    ]

    // Check if section type exists
    const existingSectionType = await prisma.sectionTypeDefinition.findUnique({
      where: { id },
    })

    if (!existingSectionType) {
      return NextResponse.json(
        { error: 'Section type not found' },
        { status: 404 }
      )
    }

    // Check if this is a built-in type and prevent slug changes
    const isBuiltIn = BUILT_IN_TYPES.includes(existingSectionType.slug.toUpperCase())
    if (isBuiltIn && slug && slug.toUpperCase() !== existingSectionType.slug.toUpperCase()) {
      return NextResponse.json(
        { error: 'Cannot change slug for built-in section types' },
        { status: 400 }
      )
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== existingSectionType.slug) {
      const slugConflict = await prisma.sectionTypeDefinition.findUnique({
        where: { slug },
      })
      if (slugConflict) {
        return NextResponse.json(
          { error: 'A section type with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== existingSectionType.name) {
      const nameConflict = await prisma.sectionTypeDefinition.findUnique({
        where: { name },
      })
      if (nameConflict) {
        return NextResponse.json(
          { error: 'A section type with this name already exists' },
          { status: 400 }
        )
      }
    }

    const sectionType = await prisma.sectionTypeDefinition.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(component !== undefined && { component }),
        ...(fields !== undefined && { fields }),
        ...(config !== undefined && { config }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(sectionType)
  } catch (error) {
    console.error('Error updating section type:', error)
    return NextResponse.json(
      { error: 'Failed to update section type' },
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

    // Built-in section types that cannot be deleted
    const BUILT_IN_TYPES = [
      'HEADER',
      'HERO',
      'FEATURES',
      'TESTIMONIALS',
      'PRICING',
      'CTA',
      'CONTENT',
      'GALLERY',
      'FAQ',
      'TEAM',
      'STATS',
      'FOOTER',
    ]

    const sectionType = await prisma.sectionTypeDefinition.findUnique({
      where: { id },
    })

    if (!sectionType) {
      return NextResponse.json(
        { error: 'Section type not found' },
        { status: 404 }
      )
    }

    // Prevent deletion of built-in types
    const isBuiltIn = BUILT_IN_TYPES.includes(sectionType.slug.toUpperCase())
    if (isBuiltIn) {
      return NextResponse.json(
        { error: 'Cannot delete built-in section types. You can deactivate them instead.' },
        { status: 400 }
      )
    }

    await prisma.sectionTypeDefinition.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Section type deleted successfully' })
  } catch (error) {
    console.error('Error deleting section type:', error)
    return NextResponse.json(
      { error: 'Failed to delete section type' },
      { status: 500 }
    )
  }
}

