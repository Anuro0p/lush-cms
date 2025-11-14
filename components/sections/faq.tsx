import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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

export function FAQSection({ section }: { section: Section }) {
  const heightStyles = getSectionHeightStyles(section.config)
  // Parse FAQ items from content (Q: question, A: answer format)
  const faqs = section.content
    ? section.content
        .split(/\n\n+/)
        .filter((item) => item.trim())
        .map((item) => {
          const lines = item.split('\n')
          const question = lines.find((l) => l.startsWith('Q:'))?.replace(/^Q:\s*/, '') || ''
          const answer = lines.find((l) => l.startsWith('A:'))?.replace(/^A:\s*/, '') || ''
          return { question, answer }
        })
        .filter((faq) => faq.question && faq.answer)
    : []

  return (
    <section className="py-24 px-4 bg-background" style={heightStyles}>
      <div className="container mx-auto max-w-4xl">
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

        {faqs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p className="mb-4">Add FAQ items in the section editor using this format:</p>
            <pre className="text-left bg-muted p-4 rounded-lg text-sm">
              {`Q: What is your question?
A: This is the answer.

Q: Another question?
A: Another answer.`}
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}

