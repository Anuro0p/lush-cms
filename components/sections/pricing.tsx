import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
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

export function PricingSection({ section }: { section: Section }) {
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

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className={i === 2 ? 'border-primary border-2' : ''}>
              <CardHeader>
                <CardTitle className="text-2xl">Plan {i}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {['Feature 1', 'Feature 2', 'Feature 3'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant={i === 2 ? 'default' : 'outline'}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

