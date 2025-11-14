# Smart CMS

A modern, Contentful/Strapi-style Content Management System built with Next.js 16, Prisma, PostgreSQL, Tailwind CSS, and Shadcn UI. Perfect for building marketing websites and landing pages.

## 🚀 Features

### Content Management
- ✅ **Pages Management** - Create and manage landing pages with custom slugs
- ✅ **Page Builder** - Visual page builder with drag-and-drop sections
- ✅ **Section Types** - 10+ pre-built section types (Hero, Features, Testimonials, Pricing, CTA, Content, Gallery, FAQ, Team, Stats)
- ✅ **Posts** - Traditional blog post management
- ✅ **Draft/Published Workflow** - Control content visibility with status management

### Media & Assets
- ✅ **Media Library** - Upload and manage images, videos, and files
- ✅ **Image Management** - Automatic image metadata (dimensions, file size)
- ✅ **File Upload** - Drag-and-drop file uploads

### SEO & Metadata
- ✅ **SEO Fields** - Meta titles, descriptions, and keywords
- ✅ **Open Graph** - OG image support for social sharing
- ✅ **URL Slugs** - Custom, SEO-friendly URLs

### Developer Experience
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Modern UI** - Beautiful Shadcn UI components
- ✅ **Responsive Design** - Works on all devices
- ✅ **Toast Notifications** - User-friendly feedback
- ✅ **Clean Architecture** - Scalable and maintainable codebase

## 📋 Prerequisites

- Node.js 18+ installed
- Docker installed (for PostgreSQL)
- npm or yarn package manager

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL Database

Make sure your PostgreSQL database is running. If you haven't started it yet, run:

```bash
docker run --name cms-postgres -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/postgres?schema=public"
```

### 4. Initialize Prisma

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database schema (Pages, Sections, Media, Posts)
- Generate the Prisma Client

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically redirect to `/pages` where you can manage your content.

## 📁 Project Structure

```
app/
  (dashboard)/
    layout.tsx              # Dashboard layout with sidebar
    pages/
      page.tsx              # Pages list
      new/
        page.tsx            # Create new page
      [id]/
        edit/
          page.tsx          # Page editor with section builder
    posts/
      page.tsx              # Posts list
      new/
        page.tsx            # Create new post
      [id]/
        edit/
          page.tsx          # Edit post
    media/
      page.tsx              # Media library
  api/
    pages/
      route.ts              # GET all, POST create
      [id]/
        route.ts            # GET one, PUT update, DELETE delete
        sections/
          route.ts          # Manage page sections
    sections/
      [id]/
        route.ts            # Update/delete sections
    media/
      route.ts              # List media
      upload/
        route.ts            # Upload files
      [id]/
        route.ts            # Delete media
    posts/
      route.ts              # Posts CRUD
      [id]/
        route.ts            # Post operations
  layout.tsx                # Root layout
  page.tsx                  # Home page (redirects to /pages)

components/
  ui/                       # Shadcn UI components

lib/
  prisma.ts                 # Prisma client singleton

prisma/
  schema.prisma             # Database schema
```

## 🎯 Usage

### Creating a Landing Page

1. Navigate to **Pages** in the sidebar
2. Click **New Page** button
3. Enter page title and slug (auto-generated from title)
4. Set status (Draft/Published/Archived)
5. Click **Create Page**
6. You'll be redirected to the page editor

### Building a Page with Sections

1. In the page editor, click **Add Section**
2. Choose a section type:
   - **Hero** - Large banner with CTA
   - **Features** - Feature grid
   - **Testimonials** - Customer testimonials
   - **Pricing** - Pricing tables
   - **CTA** - Call-to-action blocks
   - **Content** - Rich text content
   - **Gallery** - Image galleries
   - **FAQ** - Frequently asked questions
   - **Team** - Team member profiles
   - **Stats** - Statistics/metrics
3. Fill in section details (title, content, images, buttons)
4. Save the section
5. Add more sections as needed
6. Sections are ordered and can be reordered

### Managing Media

1. Navigate to **Media Library** in the sidebar
2. Click **Upload Media** button
3. Select files (images, videos, PDFs, etc.)
4. Files are automatically uploaded and stored
5. Copy URLs or delete files as needed

### SEO Optimization

1. When editing a page, scroll to **SEO Settings**
2. Enter SEO title (appears in search results)
3. Add meta description (search result snippet)
4. Add keywords (comma-separated)
5. Set OG image for social sharing

### Publishing Workflow

- **Draft** - Content is not publicly visible
- **Published** - Content is live and accessible
- **Archived** - Content is hidden but preserved

## 🗄️ Database Schema

The project uses a comprehensive schema for marketing websites:

```prisma
model Page {
  id            String      @id @default(cuid())
  title         String
  slug          String      @unique
  status        PageStatus  @default(DRAFT)
  sections      Section[]
  seoTitle      String?
  seoDescription String?
  seoKeywords   String?
  ogImage       String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Section {
  id          String      @id @default(cuid())
  pageId      String
  type        SectionType
  order       Int
  title       String?
  subtitle    String?
  content     String?     @db.Text
  imageUrl    String?
  buttonText  String?
  buttonLink  String?
  config      Json?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Media {
  id          String   @id @default(cuid())
  filename    String
  url         String
  mimeType    String
  size        Int
  width       Int?
  height      Int?
  alt         String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React

## 🎨 Section Types

The CMS includes 10 pre-built section types perfect for marketing websites:

1. **Hero** - Eye-catching banner sections with CTAs
2. **Features** - Showcase product features
3. **Testimonials** - Display customer reviews
4. **Pricing** - Pricing tables and plans
5. **CTA** - Call-to-action blocks
6. **Content** - Rich text content blocks
7. **Gallery** - Image galleries and portfolios
8. **FAQ** - Frequently asked questions
9. **Team** - Team member profiles
10. **Stats** - Statistics and metrics

Each section type is flexible and can be customized with:
- Titles and subtitles
- Rich text content
- Images
- Call-to-action buttons
- Custom JSON configuration

## 📝 Notes

- The database connection string is configured for a local PostgreSQL instance running in Docker
- All API routes are located under `app/api/`
- The dashboard uses route groups `(dashboard)` for layout organization
- Toast notifications are handled via the `useToast` hook
- Media files are stored in `public/uploads/`
- Pages can have unlimited sections
- Sections are ordered and can be reordered

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Make sure Docker is running
2. Verify the PostgreSQL container is running: `docker ps`
3. Check that the `DATABASE_URL` in `.env` matches your database configuration
4. Ensure the database is accessible on port 5432

### Prisma Client Issues

If you get Prisma Client errors:

```bash
npx prisma generate
```

This regenerates the Prisma Client based on your schema.

### File Upload Issues

- Ensure the `public/uploads/` directory exists
- Check file permissions
- Verify file size limits (adjust in `next.config.ts` if needed)

## 🚀 Next Steps

To use this CMS for your marketing website:

1. **Create Pages** - Build your landing pages
2. **Add Sections** - Use the page builder to add content sections
3. **Upload Media** - Add images and assets to your media library
4. **Configure SEO** - Optimize each page for search engines
5. **Publish** - Change status to Published when ready

## 📄 License

MIT
