import { getSectionHeightStyles } from '@/lib/section-styles'

interface Section {
  id: string
  type: string
  title?: string
  subtitle?: string
  content?: string
  config?: {
    minHeight?: string | number
    maxHeight?: string | number
    height?: string | number
  }
}

export function ContentSection({ section }: { section: Section }) {
  const heightStyles = getSectionHeightStyles(section.config)

  return (
    <section className="py-24 px-4 bg-background" style={heightStyles}>
      <div className="container mx-auto max-w-4xl">
        {section.subtitle && (
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
            {section.subtitle}
          </p>
        )}
        {section.title && (
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {section.title}
          </h2>
        )}
        {section.content && (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{
              __html: section.content.replace(/\n/g, '<br />'),
            }}
          />
        )}
      </div>
    </section>
  )
}

