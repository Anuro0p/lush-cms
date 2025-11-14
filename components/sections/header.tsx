'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
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
    menuItems?: Array<{ label: string; link: string }>
    showLogo?: boolean
    sticky?: boolean
    minHeight?: string | number
    maxHeight?: string | number
    height?: string | number
  }
}

export function HeaderSection({ section }: { section: Section }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const logoUrl = section.config?.logoUrl || section.imageUrl
  const menuItems = section.config?.menuItems || []
  const showLogo = section.config?.showLogo !== false
  const sticky = section.config?.sticky ?? true
  const heightStyles = getSectionHeightStyles(section.config)

  // Parse menu items from content if not in config
  const parsedMenuItems = menuItems.length === 0 && section.content
    ? section.content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => {
          const [label, ...linkParts] = line.split(':')
          return {
            label: label.trim(),
            link: linkParts.join(':').trim() || '#',
          }
        })
    : menuItems

  return (
    <header
      className={`w-full border-b bg-background ${
        sticky ? 'sticky top-0 z-50' : ''
      }`}
      style={heightStyles}
    >
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          {showLogo && (
            <div className="flex-shrink-0">
              {logoUrl ? (
                <Link href="/" className="flex items-center">
                  <img
                    src={logoUrl}
                    alt={section.title || 'Logo'}
                    className="h-8 w-auto"
                  />
                </Link>
              ) : (
                <Link href="/" className="text-xl font-bold">
                  {section.title || 'Logo'}
                </Link>
              )}
            </div>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {parsedMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          {section.buttonText && section.buttonLink && (
            <div className="hidden md:block">
              <Button asChild>
                <Link href={section.buttonLink}>{section.buttonText}</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {parsedMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {section.buttonText && section.buttonLink && (
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href={section.buttonLink}>{section.buttonText}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

