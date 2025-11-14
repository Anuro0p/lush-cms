import Link from 'next/link'
import { FileText, Plus, Layout, Image, Settings, Type, Clock, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card">
          <div className="flex h-full flex-col">
            <div className="border-b p-6">
              <h1 className="text-2xl font-bold">CMS Dashboard</h1>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              <div className="px-3 py-2">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                  Content
                </p>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/pages" className="flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      <span>Pages</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/posts" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Posts</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/content-types" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <span>Content Types</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/session-types" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Session Types</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/section-types" className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <span>Section Types</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                  Media
                </p>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/media" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      <span>Media Library</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                  Settings
                </p>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Global Settings</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b bg-card px-6 py-4">
            <h2 className="text-lg font-semibold">Content Management System</h2>
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

