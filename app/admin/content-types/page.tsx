'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
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

export default function ContentTypesPage() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contentTypeToDelete, setContentTypeToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchContentTypes()
  }, [])

  const fetchContentTypes = async () => {
    try {
      const response = await fetch('/api/content-types')
      if (!response.ok) throw new Error('Failed to fetch content types')
      const data = await response.json()
      setContentTypes(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load content types',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!contentTypeToDelete) return

    try {
      const response = await fetch(`/api/content-types/${contentTypeToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete content type')

      toast({
        title: 'Success',
        description: 'Content type deleted successfully',
      })

      setDeleteDialogOpen(false)
      setContentTypeToDelete(null)
      fetchContentTypes()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete content type',
        variant: 'destructive',
      })
    }
  }

  const openDeleteDialog = (id: string) => {
    setContentTypeToDelete(id)
    setDeleteDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Types</h1>
        <Link href="/admin/content-types/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Content Type
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Content Types</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading content types...
            </div>
          ) : contentTypes.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No content types found. Create your first content type!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentTypes.map((contentType) => (
                  <TableRow key={contentType.id}>
                    <TableCell className="font-medium">{contentType.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {contentType.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {contentType.description || '-'}
                    </TableCell>
                    <TableCell>{formatDate(contentType.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/content-types/${contentType.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(contentType.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this content type? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setContentTypeToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

