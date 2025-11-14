import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getSectionHeightStyles } from '@/lib/section-styles'

interface Section {
  id: string
  type: string
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
  buttonText?: string
  buttonLink?: string
  config?: {
    backgroundImageUrl?: string
    overlayOpacity?: number
    minHeight?: string | number
    maxHeight?: string | number
    height?: string | number
  }
}

export function HeroSection({ section }: { section: Section }) {
  const backgroundImageUrl = section.config?.backgroundImageUrl
  const overlayOpacity = section.config?.overlayOpacity ?? 0.5
  const heightStyles = getSectionHeightStyles(section.config)

  return (
    <section
      className="relative w-full py-24 px-4 overflow-hidden"
      style={{
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...heightStyles,
      }}
    >
      {/* Overlay */}
      {backgroundImageUrl && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Gradient overlay (if no background image) */}
      {!backgroundImageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      )}

      {/* Content */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {section.subtitle && (
              <p
                className={`text-sm font-semibold uppercase tracking-wide ${
                  backgroundImageUrl ? 'text-white' : 'text-primary'
                }`}
              >
                {section.subtitle}
              </p>
            )}
            {section.title && (
              <h1
                className={`text-5xl md:text-6xl font-bold tracking-tight ${
                  backgroundImageUrl ? 'text-white' : ''
                }`}
              >
                {section.title}
              </h1>
            )}
            {section.content && (
              <p
                className={`text-xl leading-relaxed ${
                  backgroundImageUrl
                    ? 'text-white/90'
                    : 'text-muted-foreground'
                }`}
              >
                {section.content}
              </p>
            )}
            {section.buttonText && section.buttonLink && (
              <div className="pt-4">
                <Button asChild size="lg">
                  <Link href={section.buttonLink}>{section.buttonText}</Link>
                </Button>
              </div>
            )}
          </div>
          {section.imageUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img
                src={section.imageUrl}
                alt={section.title || 'Hero image'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

