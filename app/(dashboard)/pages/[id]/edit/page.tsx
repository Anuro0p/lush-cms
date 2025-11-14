'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Plus, Trash2, GripVertical, Edit, Eye } from 'lucide-react'
import Link from 'next/link'

interface Page {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  ogImage?: string
  sections: Section[]
}

interface Section {
  id: string
  type: string
  order: number
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
  buttonText?: string
  buttonLink?: string
  config?: any
}

const SECTION_TYPES = [
  { value: 'HEADER', label: 'Header' },
  { value: 'HERO', label: 'Hero Section' },
  { value: 'FEATURES', label: 'Features' },
  { value: 'TESTIMONIALS', label: 'Testimonials' },
  { value: 'PRICING', label: 'Pricing' },
  { value: 'CTA', label: 'Call to Action' },
  { value: 'CONTENT', label: 'Content Block' },
  { value: 'GALLERY', label: 'Gallery' },
  { value: 'FAQ', label: 'FAQ' },
  { value: 'TEAM', label: 'Team' },
  { value: 'STATS', label: 'Statistics' },
  { value: 'FOOTER', label: 'Footer' },
]

export default function EditPagePage() {
  const params = useParams()
  const router = useRouter()
  const [page, setPage] = useState<Page | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const id = params.id as string
        const response = await fetch(`/api/pages/${id}`)
        if (!response.ok) throw new Error('Failed to fetch page')
        const data = await response.json()
        setPage(data)
        setTitle(data.title)
        setSlug(data.slug)
        setStatus(data.status)
        setSeoTitle(data.seoTitle || '')
        setSeoDescription(data.seoDescription || '')
        setSeoKeywords(data.seoKeywords || '')
        setSections(data.sections || [])
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load page',
          variant: 'destructive',
        })
        router.push('/admin/pages')
      } finally {
        setFetching(false)
      }
    }

    if (params.id) {
      fetchPage()
    }
  }, [params.id, router, toast])

  const handlePageUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const id = params.id as string
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          slug,
          status,
          seoTitle,
          seoDescription,
          seoKeywords,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update page')
      }

      toast({
        title: 'Success',
        description: 'Page updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update page',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSection = () => {
    setEditingSection(null)
    setSectionDialogOpen(true)
  }

  const handleEditSection = (section: Section) => {
    setEditingSection(section)
    setSectionDialogOpen(true)
  }

  const handleSaveSection = async (sectionData: Partial<Section>) => {
    try {
      const id = params.id as string
      let response

      if (editingSection) {
        // Update existing section
        response = await fetch(`/api/sections/${editingSection.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...editingSection,
            ...sectionData,
          }),
        })
      } else {
        // Create new section
        response = await fetch(`/api/pages/${id}/sections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sectionData),
        })
      }

      if (!response.ok) throw new Error('Failed to save section')

      // Refresh page data
      const pageResponse = await fetch(`/api/pages/${id}`)
      const pageData = await pageResponse.json()
      setSections(pageData.sections || [])

      setSectionDialogOpen(false)
      setEditingSection(null)

      toast({
        title: 'Success',
        description: 'Section saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save section',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete section')

      // Refresh page data
      const id = params.id as string
      const pageResponse = await fetch(`/api/pages/${id}`)
      const pageData = await pageResponse.json()
      setSections(pageData.sections || [])

      toast({
        title: 'Success',
        description: 'Section deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete section',
        variant: 'destructive',
      })
    }
  }

  if (fetching) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit Page</h1>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Loading page...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!page) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Page</h1>

      <form onSubmit={handlePageUpdate} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Meta title for search engines"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Meta description for search engines"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoKeywords">SEO Keywords</Label>
              <Input
                id="seoKeywords"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="Comma-separated keywords"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sections</CardTitle>
            <Button type="button" onClick={handleAddSection}>
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No sections yet. Add your first section to start building your page.
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="flex items-start gap-4 rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="h-5 w-5" />
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {SECTION_TYPES.find((t) => t.value === section.type)?.label ||
                              section.type}
                          </h3>
                          {section.title && (
                            <p className="text-sm text-muted-foreground">
                              {section.title}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSection(section)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Page'}
          </Button>
          {page && (
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <Link href={`/admin/pages/${page.id}/preview`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>

      <SectionDialog
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        section={editingSection}
        onSave={handleSaveSection}
      />
    </div>
  )
}

function SectionDialog({
  open,
  onOpenChange,
  section,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  section: Section | null
  onSave: (data: Partial<Section>) => void
}) {
  const [type, setType] = useState(section?.type || 'HERO')
  const [title, setTitle] = useState(section?.title || '')
  const [subtitle, setSubtitle] = useState(section?.subtitle || '')
  const [content, setContent] = useState(section?.content || '')
  const [imageUrl, setImageUrl] = useState(section?.imageUrl || '')
  const [buttonText, setButtonText] = useState(section?.buttonText || '')
  const [buttonLink, setButtonLink] = useState(section?.buttonLink || '')
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    (section?.config as any)?.backgroundImageUrl || ''
  )
  const [overlayOpacity, setOverlayOpacity] = useState(
    (section?.config as any)?.overlayOpacity ?? 0.5
  )

  useEffect(() => {
    if (section) {
      setType(section.type)
      setTitle(section.title || '')
      setSubtitle(section.subtitle || '')
      setContent(section.content || '')
      setImageUrl(section.imageUrl || '')
      setButtonText(section.buttonText || '')
      setButtonLink(section.buttonLink || '')
      setBackgroundImageUrl((section.config as any)?.backgroundImageUrl || '')
      setOverlayOpacity((section.config as any)?.overlayOpacity ?? 0.5)
    } else {
      setType('HERO')
      setTitle('')
      setSubtitle('')
      setContent('')
      setImageUrl('')
      setButtonText('')
      setButtonLink('')
      setBackgroundImageUrl('')
      setOverlayOpacity(0.5)
    }
  }, [section])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const config: any = {}
    if (backgroundImageUrl) {
      config.backgroundImageUrl = backgroundImageUrl
      config.overlayOpacity = overlayOpacity
    }
    onSave({
      type,
      title,
      subtitle,
      content,
      imageUrl,
      buttonText,
      buttonLink,
      config: Object.keys(config).length > 0 ? config : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {section ? 'Edit Section' : 'Add New Section'}
          </DialogTitle>
          <DialogDescription>
            Configure the section content and settings
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-type">Section Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-title">Title</Label>
            <Input
              id="section-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-subtitle">Subtitle</Label>
            <Input
              id="section-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Section subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-content">Content</Label>
            <Textarea
              id="section-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Section content (supports markdown)"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-image">Image URL</Label>
            <Input
              id="section-image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Side image (optional)
            </p>
          </div>

          {type === 'HERO' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="background-image">Background Image URL</Label>
                <Input
                  id="background-image"
                  value={backgroundImageUrl}
                  onChange={(e) => setBackgroundImageUrl(e.target.value)}
                  placeholder="https://example.com/background.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Full background image for hero section
                </p>
              </div>
              {backgroundImageUrl && (
                <div className="space-y-2">
                  <Label htmlFor="overlay-opacity">
                    Overlay Opacity: {Math.round(overlayOpacity * 100)}%
                  </Label>
                  <input
                    id="overlay-opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={overlayOpacity}
                    onChange={(e) =>
                      setOverlayOpacity(parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Adjust the dark overlay opacity for better text readability
                  </p>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Get Started"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="button-link">Button Link</Label>
              <Input
                id="button-link"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Section</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

