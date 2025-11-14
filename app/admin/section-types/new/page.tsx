'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

export default function NewSectionTypePage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [component, setComponent] = useState('')
  const [fields, setFields] = useState('')
  const [config, setConfig] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value))
    }
  }

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

      const response = await fetch('/api/section-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug: slug.toUpperCase(), // Section types are typically uppercase
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
        throw new Error(error.error || 'Failed to create section type')
      }

      const sectionType = await response.json()

      toast({
        title: 'Success',
        description: 'Section type created successfully',
      })

      router.push(`/admin/section-types/${sectionType.id}/edit`)
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to create section type',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Section Type</h1>

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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter section type name (e.g., Hero Section)"
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
              />
              <p className="text-sm text-muted-foreground">
                Unique identifier (typically uppercase, e.g., HERO, FEATURES)
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
                placeholder='{"title": "string", "subtitle": "string", "content": "text"}'
                rows={5}
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
                placeholder='{"backgroundColor": "blue", "layout": "grid"}'
                rows={5}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Optional JSON object for additional configuration
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Section Type'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
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

