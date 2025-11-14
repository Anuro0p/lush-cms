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

export function TeamSection({ section }: { section: Section }) {
  const heightStyles = getSectionHeightStyles(section.config)
  // Parse team members from content (Name - Role format)
  const members = section.content
    ? section.content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          const [name, ...roleParts] = line.split('-')
          return {
            name: name.trim(),
            role: roleParts.join('-').trim(),
          }
        })
        .filter((m) => m.name && m.role)
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

        {members.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p className="mb-4">Add team members in the section editor using this format:</p>
            <pre className="text-left bg-muted p-4 rounded-lg text-sm">
              {`John Doe - CEO
Jane Smith - CTO
Bob Johnson - Designer`}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}

