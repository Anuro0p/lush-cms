'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface SessionType {
  id: string
  name: string
  slug: string
  description?: string
  duration?: number
  config?: any
  createdAt: string
  updatedAt: string
}

export default function EditSessionTypePage() {
  const params = useParams()
  const router = useRouter()
  const [sessionType, setSessionType] = useState<SessionType | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [config, setConfig] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSessionType = async () => {
      try {
        const id = params.id as string
        const response = await fetch(`/api/session-types/${id}`)
        if (!response.ok) throw new Error('Failed to fetch session type')
        const data = await response.json()
        setSessionType(data)
        setName(data.name)
        setSlug(data.slug)
        setDescription(data.description || '')
        setDuration(data.duration ? data.duration.toString() : '')
        setConfig(data.config ? JSON.stringify(data.config, null, 2) : '')
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load session type',
          variant: 'destructive',
        })
        router.push('/admin/session-types')
      } finally {
        setFetching(false)
      }
    }

    fetchSessionType()
  }, [params.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let parsedConfig = null

      if (config.trim()) {
        try {
          parsedConfig = JSON.parse(config)
        } catch {
          throw new Error('Config must be valid JSON')
        }
      }

      const response = await fetch(`/api/session-types/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description: description || null,
          duration: duration ? parseInt(duration, 10) : null,
          config: parsedConfig,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update session type')
      }

      const updatedSessionType = await response.json()
      setSessionType(updatedSessionType)

      toast({
        title: 'Success',
        description: 'Session type updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update session type',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading session type...</div>
      </div>
    )
  }

  if (!sessionType) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Session Type</h1>
        <Button variant="outline" onClick={() => router.push('/admin/session-types')}>
          Back to Session Types
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter session type name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="session-type-slug"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL-friendly identifier for this session type
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

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60"
                min="1"
              />
              <p className="text-sm text-muted-foreground">
                Optional duration in minutes for this session type
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="config">Config (JSON)</Label>
              <Textarea
                id="config"
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                placeholder='{"setting1": "value1"}'
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
                onClick={() => router.push('/admin/session-types')}
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

