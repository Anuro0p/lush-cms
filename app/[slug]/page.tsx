import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { HeaderSection } from '@/components/sections/header'
import { HeroSection } from '@/components/sections/hero'
import { FeaturesSection } from '@/components/sections/features'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { PricingSection } from '@/components/sections/pricing'
import { CTASection } from '@/components/sections/cta'
import { ContentSection } from '@/components/sections/content'
import { GallerySection } from '@/components/sections/gallery'
import { FAQSection } from '@/components/sections/faq'
import { TeamSection } from '@/components/sections/team'
import { StatsSection } from '@/components/sections/stats'
import { FooterSection } from '@/components/sections/footer'
import { GlobalHeader } from '@/components/global-header'
import { GlobalFooter } from '@/components/global-footer'
import type { Metadata } from 'next'

interface Section {
  id: string
  type: string
  order: number
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
  buttonText?: string
  buttonLink?: string
  config?: any
}

interface Page {
  id: string
  title: string
  slug: string
  status: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  ogImage?: string
  sections: Section[]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  
  // Skip if it's a reserved route
  if (slug === 'admin' || slug === 'api') {
    return {}
  }

  const page = await prisma.page.findUnique({
    where: { slug },
  })

  if (!page || page.status !== 'PUBLISHED') {
    return {}
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    keywords: page.seoKeywords || undefined,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || undefined,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  }
}

export default async function PageBySlug({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Skip if it's a reserved route
  if (slug === 'admin' || slug === 'api') {
    notFound()
  }

  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  if (!page || page.status !== 'PUBLISHED') {
    notFound()
  }

  // Get global settings
  const globalHeaderSetting = await prisma.settings.findUnique({
    where: { key: 'globalHeader' },
  })
  const globalFooterSetting = await prisma.settings.findUnique({
    where: { key: 'globalFooter' },
  })

  const globalHeader = globalHeaderSetting?.value as any
  const globalFooter = globalFooterSetting?.value as any

  // Check if page has header/footer sections
  const hasPageHeader = page.sections.some((s) => s.type === 'HEADER')
  const hasPageFooter = page.sections.some((s) => s.type === 'FOOTER')

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'HEADER':
        return <HeaderSection key={section.id} section={section} />
      case 'HERO':
        return <HeroSection key={section.id} section={section} />
      case 'FEATURES':
        return <FeaturesSection key={section.id} section={section} />
      case 'TESTIMONIALS':
        return <TestimonialsSection key={section.id} section={section} />
      case 'PRICING':
        return <PricingSection key={section.id} section={section} />
      case 'CTA':
        return <CTASection key={section.id} section={section} />
      case 'CONTENT':
        return <ContentSection key={section.id} section={section} />
      case 'GALLERY':
        return <GallerySection key={section.id} section={section} />
      case 'FAQ':
        return <FAQSection key={section.id} section={section} />
      case 'TEAM':
        return <TeamSection key={section.id} section={section} />
      case 'STATS':
        return <StatsSection key={section.id} section={section} />
      case 'FOOTER':
        return <FooterSection key={section.id} section={section} />
      default:
        return (
          <div key={section.id} className="py-12 text-center text-muted-foreground">
            Unknown section type: {section.type}
          </div>
        )
    }
  }

  // Filter out header/footer sections to render separately
  const contentSections = page.sections.filter(
    (s) => s.type !== 'HEADER' && s.type !== 'FOOTER'
  )
  const pageHeaderSection = page.sections.find((s) => s.type === 'HEADER')
  const pageFooterSection = page.sections.find((s) => s.type === 'FOOTER')

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header or Global Header */}
      {pageHeaderSection ? (
        renderSection(pageHeaderSection)
      ) : (
        globalHeader && <GlobalHeader data={globalHeader} />
      )}

      {/* Page Content */}
      {contentSections.length > 0 ? (
        contentSections.map((section) => renderSection(section))
      ) : (
        <div className="py-24 text-center">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          <p className="text-muted-foreground">
            No sections added yet. Add sections in the editor to see content here.
          </p>
        </div>
      )}

      {/* Page Footer or Global Footer */}
      {pageFooterSection ? (
        renderSection(pageFooterSection)
      ) : (
        globalFooter && <GlobalFooter data={globalFooter} />
      )}
    </div>
  )
}

