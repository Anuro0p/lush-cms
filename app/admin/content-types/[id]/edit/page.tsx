'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldBuilder, FieldDefinition } from '@/components/field-builder'
import { ConfigBuilder } from '@/components/config-builder'
import { useToast } from '@/hooks/use-toast'

interface ContentType {
  id: string
  name: string
  slug: string
  description?: string
  fields?: any
  config?: any
  createdAt: string
  updatedAt: string
}

export default function EditContentTypePage() {
  const params = useParams()
  const router = useRouter()
  const [contentType, setContentType] = useState<ContentType | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState<FieldDefinition[]>([])
  const [config, setConfig] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContentType = async () => {
      try {
        const id = params.id as string
        const response = await fetch(`/api/content-types/${id}`)
        if (!response.ok) throw new Error('Failed to fetch content type')
        const data = await response.json()
        setContentType(data)
        setName(data.name)
        setSlug(data.slug)
        setDescription(data.description || '')
        setFields(Array.isArray(data.fields) ? data.fields : [])
        setConfig(data.config && typeof data.config === 'object' ? data.config : {})
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load content type',
          variant: 'destructive',
        })
        router.push('/admin/content-types')
      } finally {
        setFetching(false)
      }
    }

    fetchContentType()
  }, [params.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/content-types/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description: description || null,
          fields: fields.length > 0 ? fields : null,
          config: Object.keys(config).length > 0 ? config : null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update content type')
      }

      const updatedContentType = await response.json()
      setContentType(updatedContentType)

      toast({
        title: 'Success',
        description: 'Content type updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update content type',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading content type...</div>
      </div>
    )
  }

  if (!contentType) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Content Type</h1>
        <Button variant="outline" onClick={() => router.push('/admin/content-types')}>
          Back to Content Types
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter content type name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="content-type-slug"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL-friendly identifier for this content type
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

            <div className="space-y-4">
              <FieldBuilder fields={fields} onChange={setFields} />
            </div>

            <div className="space-y-4">
              <ConfigBuilder config={config} onChange={setConfig} />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/content-types')}
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

