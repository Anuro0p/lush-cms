'use client'

import { FooterSection } from './sections/footer'

interface GlobalFooterData {
  title?: string
  subtitle?: string
  logoUrl?: string
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

export function GlobalFooter({ data }: { data: GlobalFooterData }) {
  // Convert global footer data to section format
  const section = {
    id: 'global-footer',
    type: 'FOOTER',
    title: data.title,
    subtitle: data.subtitle,
    imageUrl: data.logoUrl,
    config: {
      logoUrl: data.logoUrl,
      showLogo: true,
      socialLinks: data.socialLinks,
      columns: data.columns,
      copyright: data.copyright,
      minHeight: data.minHeight,
      maxHeight: data.maxHeight,
      height: data.height,
    },
  }

  return <FooterSection section={section} />
}
