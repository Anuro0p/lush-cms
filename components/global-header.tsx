'use client'

import { HeaderSection } from './sections/header'

interface GlobalHeaderData {
  title?: string
  logoUrl?: string
  menuItems?: Array<{ label: string; link: string }>
  buttonText?: string
  buttonLink?: string
  sticky?: boolean
  minHeight?: string | number
  maxHeight?: string | number
  height?: string | number
}

export function GlobalHeader({ data }: { data: GlobalHeaderData }) {
  // Convert global header data to section format
  const section = {
    id: 'global-header',
    type: 'HEADER',
    title: data.title,
    imageUrl: data.logoUrl,
    buttonText: data.buttonText,
    buttonLink: data.buttonLink,
    config: {
      logoUrl: data.logoUrl,
      menuItems: data.menuItems,
      showLogo: true,
      sticky: data.sticky ?? true,
      minHeight: data.minHeight,
      maxHeight: data.maxHeight,
      height: data.height,
    },
  }

  return <HeaderSection section={section} />
}

