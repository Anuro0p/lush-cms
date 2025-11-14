import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'
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
    logoUrl?: string
    showLogo?: boolean
    socialLinks?: {
      facebook?: string
      twitter?: string
      instagram?: string
      linkedin?: string
      email?: string
      phone?: string
    }
    columns?: Array<{
      title: string
      links: Array<{ label: string; link: string }>
    }>
    copyright?: string
    minHeight?: string | number
    maxHeight?: string | number
    height?: string | number
  }
}

export function FooterSection({ section }: { section: Section }) {
  const logoUrl = section.config?.logoUrl || section.imageUrl
  const showLogo = section.config?.showLogo !== false
  const socialLinks = section.config?.socialLinks || {}
  const columns = section.config?.columns || []
  const copyright = section.config?.copyright || `© ${new Date().getFullYear()} ${section.title || 'Company'}. All rights reserved.`
  const heightStyles = getSectionHeightStyles(section.config)

  // Parse columns from content if not in config
  const parsedColumns = columns.length === 0 && section.content
    ? section.content
        .split('\n\n')
        .filter((block) => block.trim())
        .map((block) => {
          const lines = block.split('\n')
          const title = lines[0] || 'Column'
          const links = lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line) => {
              const [label, ...linkParts] = line.split(':')
              return {
                label: label.trim(),
                link: linkParts.join(':').trim() || '#',
              }
            })
          return { title, links }
        })
    : columns

  return (
    <footer className="w-full bg-muted border-t" style={heightStyles}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            {showLogo && (
              <div>
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={section.title || 'Logo'}
                    className="h-8 w-auto mb-4"
                  />
                ) : (
                  <h3 className="text-xl font-bold mb-4">
                    {section.title || 'Company'}
                  </h3>
                )}
              </div>
            )}
            {section.subtitle && (
              <p className="text-sm text-muted-foreground">
                {section.subtitle}
              </p>
            )}
            {/* Social Links */}
            {(socialLinks.facebook ||
              socialLinks.twitter ||
              socialLinks.instagram ||
              socialLinks.linkedin ||
              socialLinks.email ||
              socialLinks.phone) && (
              <div className="flex gap-4 pt-4">
                {socialLinks.facebook && (
                  <Link
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                )}
                {socialLinks.twitter && (
                  <Link
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                )}
                {socialLinks.instagram && (
                  <Link
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                )}
                {socialLinks.linkedin && (
                  <Link
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                )}
                {socialLinks.email && (
                  <Link
                    href={`mailto:${socialLinks.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </Link>
                )}
                {socialLinks.phone && (
                  <Link
                    href={`tel:${socialLinks.phone}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Footer Columns */}
          {parsedColumns.map((column, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.link}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          {copyright}
        </div>
      </div>
    </footer>
  )
}

