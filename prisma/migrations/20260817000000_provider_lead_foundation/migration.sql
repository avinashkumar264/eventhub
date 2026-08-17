-- AlterTable
ALTER TABLE "Provider" ADD COLUMN "experienceYears" INTEGER;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "viewedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ProviderMedia" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderMedia_providerId_idx" ON "ProviderMedia"("providerId");

-- AddForeignKey
ALTER TABLE "ProviderMedia" ADD CONSTRAINT "ProviderMedia_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
