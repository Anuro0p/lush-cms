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
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface SectionType {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  component?: string
  fields?: any
  config?: any
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function EditSectionTypePage() {
  const params = useParams()
  const router = useRouter()
  const [sectionType, setSectionType] = useState<SectionType | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [component, setComponent] = useState('')
  const [fields, setFields] = useState('')
  const [config, setConfig] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { toast } = useToast()

  const EXISTING_SECTION_TYPES = [
    'HEADER',
    'HERO',
    'FEATURES',
    'TESTIMONIALS',
    'PRICING',
    'CTA',
    'CONTENT',
    'GALLERY',
    'FAQ',
    'TEAM',
    'STATS',
    'FOOTER',
  ]

  const isBuiltIn = sectionType && EXISTING_SECTION_TYPES.includes(sectionType.slug.toUpperCase())

  useEffect(() => {
    const fetchSectionType = async () => {
      try {
        const id = params.id as string
        const response = await fetch(`/api/section-types/${id}`)
        if (!response.ok) throw new Error('Failed to fetch section type')
        const data = await response.json()
        setSectionType(data)
        setName(data.name)
        setSlug(data.slug)
        setDescription(data.description || '')
        setIcon(data.icon || '')
        setComponent(data.component || '')
        setFields(data.fields ? JSON.stringify(data.fields, null, 2) : '')
        setConfig(data.config ? JSON.stringify(data.config, null, 2) : '')
        setIsActive(data.isActive !== undefined ? data.isActive : true)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load section type',
          variant: 'destructive',
        })
        router.push('/admin/section-types')
      } finally {
        setFetching(false)
      }
    }

    fetchSectionType()
  }, [params.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let parsedFields = null
      let parsedConfig = null

      if (fields.trim()) {
        try {
          parsedFields = JSON.parse(fields)
        } catch {
          throw new Error('Fields must be valid JSON')
        }
      }

      if (config.trim()) {
        try {
          parsedConfig = JSON.parse(config)
        } catch {
          throw new Error('Config must be valid JSON')
        }
      }

      const response = await fetch(`/api/section-types/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug: slug.toUpperCase(),
          description: description || null,
          icon: icon || null,
          component: component || null,
          fields: parsedFields,
          config: parsedConfig,
          isActive,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update section type')
      }

      const updatedSectionType = await response.json()
      setSectionType(updatedSectionType)

      toast({
        title: 'Success',
        description: 'Section type updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update section type',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading section type...</div>
      </div>
    )
  }

  if (!sectionType) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Edit Section Type</h1>
          {isBuiltIn && (
            <Badge variant="outline" className="text-sm">
              Built-in
            </Badge>
          )}
        </div>
        <Button variant="outline" onClick={() => router.push('/admin/section-types')}>
          Back to Section Types
        </Button>
      </div>

      {isBuiltIn && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is a built-in section type. You can edit its description, icon, component,
            fields, and config, but the slug cannot be changed.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Section Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter section type name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="HERO"
                required
                disabled={isBuiltIn}
              />
              <p className="text-sm text-muted-foreground">
                Unique identifier (typically uppercase)
                {isBuiltIn && ' - Cannot be changed for built-in types'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="hero or lucide icon name"
                />
                <p className="text-sm text-muted-foreground">
                  Icon identifier (optional)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="component">Component Name</Label>
                <Input
                  id="component"
                  value={component}
                  onChange={(e) => setComponent(e.target.value)}
                  placeholder="HeroSection"
                />
                <p className="text-sm text-muted-foreground">
                  React component name (optional)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <Select
                value={isActive ? 'true' : 'false'}
                onValueChange={(value) => setIsActive(value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fields">Fields (JSON)</Label>
              <Textarea
                id="fields"
                value={fields}
                onChange={(e) => setFields(e.target.value)}
                placeholder='{"title": "string", "subtitle": "string"}'
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Optional JSON object defining the fields for this section type
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="config">Config (JSON)</Label>
              <Textarea
                id="config"
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                placeholder='{"backgroundColor": "blue"}'
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Optional JSON object for additional configuration
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/section-types')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

