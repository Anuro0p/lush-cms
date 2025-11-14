-- CreateTable
CREATE TABLE "SectionTypeDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "component" TEXT,
    "fields" JSONB,
    "config" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionTypeDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SectionTypeDefinition_name_key" ON "SectionTypeDefinition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SectionTypeDefinition_slug_key" ON "SectionTypeDefinition"("slug");
