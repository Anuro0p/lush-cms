import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'
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

export function TestimonialsSection({ section }: { section: Section }) {
  const heightStyles = getSectionHeightStyles(section.config)
  // Parse testimonials from content
  const testimonials = section.content
    ? section.content.split('\n\n').filter((t) => t.trim())
    : []

  return (
    <section className="py-24 px-4 bg-muted/50" style={heightStyles}>
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

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.length > 0 ? (
            testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-muted-foreground mb-4 italic">
                    {testimonial}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <Card key={i} className="border-2">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-muted-foreground">
                    Add testimonial content in the section editor
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

