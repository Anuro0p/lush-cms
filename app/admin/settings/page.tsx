'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface GlobalHeader {
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

interface GlobalFooter {
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

export default function SettingsPage() {
  const [header, setHeader] = useState<GlobalHeader>({})
  const [footer, setFooter] = useState<GlobalFooter>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()
      
      setHeader((data.globalHeader as GlobalHeader) || {})
      setFooter((data.globalFooter as GlobalFooter) || {})
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const saveHeader = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'globalHeader',
          value: header,
        }),
      })

      if (!response.ok) throw new Error('Failed to save header')

      toast({
        title: 'Success',
        description: 'Global header saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save header',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const saveFooter = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'globalFooter',
          value: footer,
        }),
      })

      if (!response.ok) throw new Error('Failed to save footer')

      toast({
        title: 'Success',
        description: 'Global footer saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save footer',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const addMenuItem = () => {
    setHeader({
      ...header,
      menuItems: [...(header.menuItems || []), { label: '', link: '' }],
    })
  }

  const updateMenuItem = (index: number, field: 'label' | 'link', value: string) => {
    const items = [...(header.menuItems || [])]
    items[index] = { ...items[index], [field]: value }
    setHeader({ ...header, menuItems: items })
  }

  const removeMenuItem = (index: number) => {
    const items = [...(header.menuItems || [])]
    items.splice(index, 1)
    setHeader({ ...header, menuItems: items })
  }

  const addFooterColumn = () => {
    setFooter({
      ...footer,
      columns: [...(footer.columns || []), { title: '', links: [] }],
    })
  }

  const updateFooterColumn = (index: number, title: string) => {
    const columns = [...(footer.columns || [])]
    columns[index] = { ...columns[index], title }
    setFooter({ ...footer, columns })
  }

  const addFooterLink = (columnIndex: number) => {
    const columns = [...(footer.columns || [])]
    columns[columnIndex].links = [...(columns[columnIndex].links || []), { label: '', link: '' }]
    setFooter({ ...footer, columns })
  }

  const updateFooterLink = (columnIndex: number, linkIndex: number, field: 'label' | 'link', value: string) => {
    const columns = [...(footer.columns || [])]
    columns[columnIndex].links[linkIndex] = {
      ...columns[columnIndex].links[linkIndex],
      [field]: value,
    }
    setFooter({ ...footer, columns })
  }

  const removeFooterLink = (columnIndex: number, linkIndex: number) => {
    const columns = [...(footer.columns || [])]
    columns[columnIndex].links.splice(linkIndex, 1)
    setFooter({ ...footer, columns })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="text-center py-8 text-muted-foreground">
          Loading settings...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Global Settings</h1>

      <Tabs defaultValue="header" className="space-y-6">
        <TabsList>
          <TabsTrigger value="header">Global Header</TabsTrigger>
          <TabsTrigger value="footer">Global Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="header">
          <Card>
            <CardHeader>
              <CardTitle>Global Header Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                This header will be used on all pages that don't have their own header section.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="header-title">Logo Text</Label>
                <Input
                  id="header-title"
                  value={header.title || ''}
                  onChange={(e) => setHeader({ ...header, title: e.target.value })}
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="header-logo">Logo URL</Label>
                <Input
                  id="header-logo"
                  value={header.logoUrl || ''}
                  onChange={(e) => setHeader({ ...header, logoUrl: e.target.value })}
                  placeholder="/logo.png"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Menu Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMenuItem}>
                    Add Item
                  </Button>
                </div>
                {(header.menuItems || []).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item.label}
                      onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                      placeholder="Label"
                    />
                    <Input
                      value={item.link}
                      onChange={(e) => updateMenuItem(index, 'link', e.target.value)}
                      placeholder="/link"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMenuItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="header-button-text">CTA Button Text</Label>
                  <Input
                    id="header-button-text"
                    value={header.buttonText || ''}
                    onChange={(e) => setHeader({ ...header, buttonText: e.target.value })}
                    placeholder="Get Started"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="header-button-link">CTA Button Link</Label>
                  <Input
                    id="header-button-link"
                    value={header.buttonLink || ''}
                    onChange={(e) => setHeader({ ...header, buttonLink: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="header-sticky"
                  checked={header.sticky ?? true}
                  onChange={(e) => setHeader({ ...header, sticky: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="header-sticky">Sticky Header</Label>
              </div>

              <div className="border-t pt-4 space-y-4">
                <Label className="text-base font-semibold">Height Settings (px)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="header-height">Height</Label>
                    <Input
                      id="header-height"
                      type="number"
                      value={header.height || ''}
                      onChange={(e) => setHeader({ ...header, height: e.target.value })}
                      placeholder="Auto"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="header-min-height">Min Height</Label>
                    <Input
                      id="header-min-height"
                      type="number"
                      value={header.minHeight || ''}
                      onChange={(e) => setHeader({ ...header, minHeight: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="header-max-height">Max Height</Label>
                    <Input
                      id="header-max-height"
                      type="number"
                      value={header.maxHeight || ''}
                      onChange={(e) => setHeader({ ...header, maxHeight: e.target.value })}
                      placeholder="None"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveHeader} disabled={saving}>
                {saving ? 'Saving...' : 'Save Header'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Global Footer Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                This footer will be used on all pages that don't have their own footer section.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="footer-title">Company Name</Label>
                <Input
                  id="footer-title"
                  value={footer.title || ''}
                  onChange={(e) => setFooter({ ...footer, title: e.target.value })}
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-subtitle">Description</Label>
                <Textarea
                  id="footer-subtitle"
                  value={footer.subtitle || ''}
                  onChange={(e) => setFooter({ ...footer, subtitle: e.target.value })}
                  placeholder="Company description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-logo">Logo URL</Label>
                <Input
                  id="footer-logo"
                  value={footer.logoUrl || ''}
                  onChange={(e) => setFooter({ ...footer, logoUrl: e.target.value })}
                  placeholder="/logo.png"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Footer Columns</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFooterColumn}>
                    Add Column
                  </Button>
                </div>
                {(footer.columns || []).map((column, colIndex) => (
                  <div key={colIndex} className="border rounded-lg p-4 space-y-4">
                    <Input
                      value={column.title}
                      onChange={(e) => updateFooterColumn(colIndex, e.target.value)}
                      placeholder="Column Title"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Links</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addFooterLink(colIndex)}
                        >
                          Add Link
                        </Button>
                      </div>
                      {column.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="flex gap-2">
                          <Input
                            value={link.label}
                            onChange={(e) =>
                              updateFooterLink(colIndex, linkIndex, 'label', e.target.value)
                            }
                            placeholder="Label"
                          />
                          <Input
                            value={link.link}
                            onChange={(e) =>
                              updateFooterLink(colIndex, linkIndex, 'link', e.target.value)
                            }
                            placeholder="/link"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFooterLink(colIndex, linkIndex)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Label>Social Links</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={footer.socialLinks?.facebook || ''}
                    onChange={(e) =>
                      setFooter({
                        ...footer,
                        socialLinks: { ...footer.socialLinks, facebook: e.target.value },
                      })
                    }
                    placeholder="Facebook URL"
                  />
                  <Input
                    value={footer.socialLinks?.twitter || ''}
                    onChange={(e) =>
                      setFooter({
                        ...footer,
                        socialLinks: { ...footer.socialLinks, twitter: e.target.value },
                      })
                    }
                    placeholder="Twitter URL"
                  />
                  <Input
                    value={footer.socialLinks?.instagram || ''}
                    onChange={(e) =>
                      setFooter({
                        ...footer,
                        socialLinks: { ...footer.socialLinks, instagram: e.target.value },
                      })
                    }
                    placeholder="Instagram URL"
                  />
                  <Input
                    value={footer.socialLinks?.linkedin || ''}
                    onChange={(e) =>
                      setFooter({
                        ...footer,
                        socialLinks: { ...footer.socialLinks, linkedin: e.target.value },
                      })
                    }
                    placeholder="LinkedIn URL"
                  />
                  <Input
                    value={footer.socialLinks?.email || ''}
                    onChange={(e) =>
                      setFooter({
                        ...footer,
                        socialLinks: { ...footer.socialLinks, email: e.target.value },
                      })
                    }
                    placeholder="Email"
                  />
                  <Input
                    value={footer.socialLinks?.phone || ''}
                    onChange={(e) =>
                      setFooter({
                        ...footer,
                        socialLinks: { ...footer.socialLinks, phone: e.target.value },
                      })
                    }
                    placeholder="Phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer-copyright">Copyright Text</Label>
                <Input
                  id="footer-copyright"
                  value={footer.copyright || ''}
                  onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
                  placeholder="© 2024 Company. All rights reserved."
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <Label className="text-base font-semibold">Height Settings (px)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="footer-height">Height</Label>
                    <Input
                      id="footer-height"
                      type="number"
                      value={footer.height || ''}
                      onChange={(e) => setFooter({ ...footer, height: e.target.value })}
                      placeholder="Auto"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footer-min-height">Min Height</Label>
                    <Input
                      id="footer-min-height"
                      type="number"
                      value={footer.minHeight || ''}
                      onChange={(e) => setFooter({ ...footer, minHeight: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footer-max-height">Max Height</Label>
                    <Input
                      id="footer-max-height"
                      type="number"
                      value={footer.maxHeight || ''}
                      onChange={(e) => setFooter({ ...footer, maxHeight: e.target.value })}
                      placeholder="None"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveFooter} disabled={saving}>
                {saving ? 'Saving...' : 'Save Footer'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

