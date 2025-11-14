import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getSectionHeightStyles } from '@/lib/section-styles'

interface Section {
  id: string
  type: string
  title?: string
  subtitle?: string
  content?: string
  buttonText?: string
  buttonLink?: string
  config?: {
    minHeight?: string | number
    maxHeight?: string | number
    height?: string | number
  }
}

export function CTASection({ section }: { section: Section }) {
  const heightStyles = getSectionHeightStyles(section.config)

  return (
    <section className="py-24 px-4 bg-primary text-primary-foreground" style={heightStyles}>
      <div className="container mx-auto max-w-4xl text-center">
        {section.subtitle && (
          <p className="text-sm font-semibold uppercase tracking-wide mb-4 opacity-90">
            {section.subtitle}
          </p>
        )}
        {section.title && (
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {section.title}
          </h2>
        )}
        {section.content && (
          <p className="text-xl mb-8 opacity-90">
            {section.content}
          </p>
        )}
        {section.buttonText && section.buttonLink && (
          <Button asChild size="lg" variant="secondary">
            <Link href={section.buttonLink}>{section.buttonText}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}

