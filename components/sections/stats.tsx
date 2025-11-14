import { Card, CardContent } from '@/components/ui/card'
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

export function StatsSection({ section }: { section: Section }) {
  const heightStyles = getSectionHeightStyles(section.config)
  // Parse stats from content (Label: Value format)
  const stats = section.content
    ? section.content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          const [label, value] = line.split(':')
          return {
            label: label?.trim() || '',
            value: value?.trim() || '',
          }
        })
        .filter((stat) => stat.label && stat.value)
    : []

  return (
    <section className="py-24 px-4 bg-primary/5" style={heightStyles}>
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

        {stats.length > 0 ? (
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-2">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p className="mb-4">Add statistics in the section editor using this format:</p>
            <pre className="text-left bg-muted p-4 rounded-lg text-sm">
              {`Users: 10,000+
Projects: 500+
Countries: 50+
Happy Clients: 1,000+`}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}

