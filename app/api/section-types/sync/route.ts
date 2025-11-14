import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Built-in section types with default configurations
const BUILT_IN_SECTION_TYPES = [
  {
    name: 'Header',
    slug: 'HEADER',
    description: 'Navigation header section',
    icon: 'layout',
    component: 'HeaderSection',
  },
  {
    name: 'Hero Section',
    slug: 'HERO',
    description: 'Eye-catching banner section with CTA',
    icon: 'zap',
    component: 'HeroSection',
  },
  {
    name: 'Features',
    slug: 'FEATURES',
    description: 'Showcase product features',
    icon: 'star',
    component: 'FeaturesSection',
  },
  {
    name: 'Testimonials',
    slug: 'TESTIMONIALS',
    description: 'Display customer reviews and testimonials',
    icon: 'message-square',
    component: 'TestimonialsSection',
  },
  {
    name: 'Pricing',
    slug: 'PRICING',
    description: 'Pricing tables and plans',
    icon: 'dollar-sign',
    component: 'PricingSection',
  },
  {
    name: 'Call to Action',
    slug: 'CTA',
    description: 'Call-to-action blocks',
    icon: 'target',
    component: 'CTASection',
  },
  {
    name: 'Content Block',
    slug: 'CONTENT',
    description: 'Rich text content blocks',
    icon: 'file-text',
    component: 'ContentSection',
  },
  {
    name: 'Gallery',
    slug: 'GALLERY',
    description: 'Image galleries and portfolios',
    icon: 'image',
    component: 'GallerySection',
  },
  {
    name: 'FAQ',
    slug: 'FAQ',
    description: 'Frequently asked questions',
    icon: 'help-circle',
    component: 'FAQSection',
  },
  {
    name: 'Team',
    slug: 'TEAM',
    description: 'Team member profiles',
    icon: 'users',
    component: 'TeamSection',
  },
  {
    name: 'Statistics',
    slug: 'STATS',
    description: 'Statistics and metrics',
    icon: 'bar-chart',
    component: 'StatsSection',
  },
  {
    name: 'Footer',
    slug: 'FOOTER',
    description: 'Footer section',
    icon: 'layout',
    component: 'FooterSection',
  },
]

export async function POST() {
  try {
    const results = []

    for (const sectionType of BUILT_IN_SECTION_TYPES) {
      // Check if it already exists
      const existing = await prisma.sectionTypeDefinition.findUnique({
        where: { slug: sectionType.slug },
      })

      if (existing) {
        // Update existing if needed (preserve user modifications)
        results.push(existing)
      } else {
        // Create new entry
        const created = await prisma.sectionTypeDefinition.create({
          data: {
            name: sectionType.name,
            slug: sectionType.slug,
            description: sectionType.description,
            icon: sectionType.icon,
            component: sectionType.component,
            isActive: true,
          },
        })
        results.push(created)
      }
    }

    return NextResponse.json({
      message: 'Built-in section types synced successfully',
      count: results.length,
      sectionTypes: results,
    })
  } catch (error) {
    console.error('Error syncing section types:', error)
    return NextResponse.json(
      { error: 'Failed to sync section types' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const results = []

    for (const sectionType of BUILT_IN_SECTION_TYPES) {
      const existing = await prisma.sectionTypeDefinition.findUnique({
        where: { slug: sectionType.slug },
      })

      if (existing) {
        results.push(existing)
      } else {
        // Return template for missing types
        results.push({
          ...sectionType,
          id: null,
          isActive: true,
          createdAt: null,
          updatedAt: null,
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching built-in section types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch built-in section types' },
      { status: 500 }
    )
  }
}

