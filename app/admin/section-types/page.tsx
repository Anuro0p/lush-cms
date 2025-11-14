'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Plus, CheckCircle2, XCircle } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

// Existing enum section types for reference
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

export default function SectionTypesPage() {
  const [sectionTypes, setSectionTypes] = useState<SectionType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sectionTypeToDelete, setSectionTypeToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchSectionTypes()
  }, [])

  const fetchSectionTypes = async () => {
    try {
      // First, sync built-in section types to ensure they exist in the database
      await fetch('/api/section-types/sync', { method: 'POST' })
      
      // Then fetch all section types
      const response = await fetch('/api/section-types')
      if (!response.ok) throw new Error('Failed to fetch section types')
      const data = await response.json()
      setSectionTypes(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load section types',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!sectionTypeToDelete) return

    const sectionType = sectionTypes.find((st) => st.id === sectionTypeToDelete)
    const isBuiltIn = sectionType && isExistingType(sectionType.slug)

    if (isBuiltIn) {
      toast({
        title: 'Cannot Delete',
        description: 'Built-in section types cannot be deleted. You can deactivate them instead.',
        variant: 'destructive',
      })
      setDeleteDialogOpen(false)
      setSectionTypeToDelete(null)
      return
    }

    try {
      const response = await fetch(`/api/section-types/${sectionTypeToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete section type')

      toast({
        title: 'Success',
        description: 'Section type deleted successfully',
      })

      setDeleteDialogOpen(false)
      setSectionTypeToDelete(null)
      fetchSectionTypes()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete section type',
        variant: 'destructive',
      })
    }
  }

  const openDeleteDialog = (id: string) => {
    setSectionTypeToDelete(id)
    setDeleteDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isExistingType = (slug: string) => {
    return EXISTING_SECTION_TYPES.some(
      (type) => type === slug.toUpperCase()
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Section Types</h1>
          <p className="text-muted-foreground mt-1">
            Manage available section types (Hero, Features, etc.)
          </p>
        </div>
        <Link href="/admin/section-types/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Section Type
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Section Types</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading section types...
            </div>
          ) : sectionTypes.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No custom section types found.</p>
              <p className="mt-2">
                Note: The following section types are available by default:{' '}
                {EXISTING_SECTION_TYPES.join(', ')}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionTypes.map((sectionType) => (
                  <TableRow key={sectionType.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {sectionType.name}
                        {isExistingType(sectionType.slug) && (
                          <Badge variant="outline" className="text-xs">
                            Built-in
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {sectionType.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sectionType.description || '-'}
                    </TableCell>
                    <TableCell>
                      {sectionType.isActive ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <XCircle className="mr-1 h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sectionType.component || '-'}
                    </TableCell>
                    <TableCell>{formatDate(sectionType.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/section-types/${sectionType.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        {!isExistingType(sectionType.slug) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(sectionType.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Show existing enum types as reference */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle>Built-in Section Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {EXISTING_SECTION_TYPES.map((type) => (
                <Badge key={type} variant="outline">
                  {type}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              These section types are available by default. You can add custom section
              types above.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Section Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this section type? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setSectionTypeToDelete(null)
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

