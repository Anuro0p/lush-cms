import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export function FeaturesSection({ section }: { section: Section }) {
  // Parse features from content (assuming markdown or JSON format)
  const features = section.content
    ? section.content.split('\n').filter((line) => line.trim().startsWith('-'))
    : []
  const heightStyles = getSectionHeightStyles(section.config)

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

        {features.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    {feature.replace(/^-\s*/, '')}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-2">
                <CardHeader>
                  <CardTitle>Feature {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add feature content in the section editor
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

