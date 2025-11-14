import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sections = await prisma.section.findMany({
      where: { pageId: id },
      orderBy: {
        order: 'asc',
      },
    })
    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { type, title, subtitle, content, imageUrl, buttonText, buttonLink, config, order } = body

    if (!type) {
      return NextResponse.json(
        { error: 'Section type is required' },
        { status: 400 }
      )
    }

    // Get the highest order number for this page
    const maxOrder = await prisma.section.findFirst({
      where: { pageId: id },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const section = await prisma.section.create({
      data: {
        pageId: id,
        type,
        order: order ?? (maxOrder ? maxOrder.order + 1 : 0),
        title,
        subtitle,
        content,
        imageUrl,
        buttonText,
        buttonLink,
        config: config || {},
      },
    })

    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    )
  }
}

