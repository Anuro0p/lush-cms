import { getSectionHeightStyles } from '@/lib/section-styles'

interface Section {
  id: string
  type: string
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
  config?: {
    minHeight?: string | number
    maxHeight?: string | number
    height?: string | number
  }
}

export function GallerySection({ section }: { section: Section }) {
  const heightStyles = getSectionHeightStyles(section.config)
  // Parse image URLs from content (one per line)
  const images = section.content
    ? section.content.split('\n').filter((url) => url.trim().startsWith('http'))
    : section.imageUrl
    ? [section.imageUrl]
    : []

  return (
    <section className="py-24 px-4 bg-background" style={heightStyles}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          {section.subtitle && (
            <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
              {section.subtitle}
            </p>
          )}
          {section.title && (
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {section.title}
            </h2>
          )}
        </div>

        {images.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            Add image URLs in the section editor (one per line)
          </div>
        )}
      </div>
    </section>
  )
}

