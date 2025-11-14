'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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

interface Page {
  id: string
  title: string
  slug: string
  status: string
  sections: Section[]
}

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

export default function PreviewPage() {
  const params = useParams()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)

  const [globalHeader, setGlobalHeader] = useState<any>(null)
  const [globalFooter, setGlobalFooter] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string
        const [pageResponse, settingsResponse] = await Promise.all([
          fetch(`/api/pages/${id}`),
          fetch('/api/settings'),
        ])

        if (!pageResponse.ok) throw new Error('Failed to fetch page')
        const pageData = await pageResponse.json()
        setPage(pageData)

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setGlobalHeader(settingsData.globalHeader)
          setGlobalFooter(settingsData.globalFooter)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading preview...</div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page not found</h1>
          <Link href="/admin/pages">
            <Button>Back to Pages</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Filter out header/footer sections to render separately
  const contentSections = page.sections?.filter(
    (s: Section) => s.type !== 'HEADER' && s.type !== 'FOOTER'
  ) || []
  const pageHeaderSection = page.sections?.find((s: Section) => s.type === 'HEADER')
  const pageFooterSection = page.sections?.find((s: Section) => s.type === 'FOOTER')

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-sm font-medium text-center">
        <div className="flex items-center justify-center gap-2">
          <span>👁️ Preview Mode</span>
          <span className="text-yellow-700">•</span>
          <span>Status: {page.status}</span>
          <span className="text-yellow-700">•</span>
          <Link href={`/admin/pages/${page.id}/edit`}>
            <Button variant="link" className="text-yellow-900 h-auto p-0 underline">
              Edit Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Page Header or Global Header */}
      {pageHeaderSection ? (
        renderSection(pageHeaderSection)
      ) : (
        globalHeader && <GlobalHeader data={globalHeader} />
      )}

      {/* Page Content */}
      <div className="w-full">
        {contentSections.length > 0 ? (
          contentSections.map((section: Section) => renderSection(section))
        ) : (
          <div className="py-24 text-center">
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-muted-foreground">
              No sections added yet. Add sections in the editor to see content here.
            </p>
          </div>
        )}
      </div>

      {/* Page Footer or Global Footer */}
      {pageFooterSection ? (
        renderSection(pageFooterSection)
      ) : (
        globalFooter && <GlobalFooter data={globalFooter} />
      )}
    </div>
  )
}

