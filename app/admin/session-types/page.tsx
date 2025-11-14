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

export default function SessionTypesPage() {
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionTypeToDelete, setSessionTypeToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchSessionTypes()
  }, [])

  const fetchSessionTypes = async () => {
    try {
      const response = await fetch('/api/session-types')
      if (!response.ok) throw new Error('Failed to fetch session types')
      const data = await response.json()
      setSessionTypes(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load session types',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!sessionTypeToDelete) return

    try {
      const response = await fetch(`/api/session-types/${sessionTypeToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete session type')

      toast({
        title: 'Success',
        description: 'Session type deleted successfully',
      })

      setDeleteDialogOpen(false)
      setSessionTypeToDelete(null)
      fetchSessionTypes()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete session type',
        variant: 'destructive',
      })
    }
  }

  const openDeleteDialog = (id: string) => {
    setSessionTypeToDelete(id)
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
        <h1 className="text-3xl font-bold">Session Types</h1>
        <Link href="/admin/session-types/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Session Type
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Session Types</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading session types...
            </div>
          ) : sessionTypes.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No session types found. Create your first session type!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionTypes.map((sessionType) => (
                  <TableRow key={sessionType.id}>
                    <TableCell className="font-medium">{sessionType.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {sessionType.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sessionType.description || '-'}
                    </TableCell>
                    <TableCell>
                      {sessionType.duration
                        ? `${sessionType.duration} minutes`
                        : '-'}
                    </TableCell>
                    <TableCell>{formatDate(sessionType.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/session-types/${sessionType.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteDialog(sessionType.id)}
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
            <DialogTitle>Delete Session Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this session type? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setSessionTypeToDelete(null)
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

