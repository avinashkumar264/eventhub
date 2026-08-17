-- Rebuild QuotationStatus with the Day 6 status set (adds SUBMITTED/WITHDRAWN,
-- renames SENT->SUBMITTED and DECLINED->REJECTED for any existing rows).
ALTER TYPE "QuotationStatus" RENAME TO "QuotationStatus_old";
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'EXPIRED', 'WITHDRAWN', 'ACCEPTED', 'REJECTED');

ALTER TABLE "Quotation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Quotation" ALTER COLUMN "status" TYPE "QuotationStatus" USING (
  CASE "status"::text
    WHEN 'SENT' THEN 'SUBMITTED'
    WHEN 'DECLINED' THEN 'REJECTED'
    ELSE "status"::text
  END
)::"QuotationStatus";
ALTER TABLE "Quotation" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
DROP TYPE "QuotationStatus_old";

-- Money breakdown + title/description/details, backfilled from the old
-- single "amount"/"notes" columns so existing rows stay valid.
ALTER TABLE "Quotation" ADD COLUMN "title" TEXT;
UPDATE "Quotation" SET "title" = 'Quotation' WHERE "title" IS NULL;
ALTER TABLE "Quotation" ALTER COLUMN "title" SET NOT NULL;

ALTER TABLE "Quotation" ADD COLUMN "baseAmount" DECIMAL(10,2);
UPDATE "Quotation" SET "baseAmount" = "amount" WHERE "baseAmount" IS NULL;
ALTER TABLE "Quotation" ALTER COLUMN "baseAmount" SET NOT NULL;

ALTER TABLE "Quotation" ADD COLUMN "additionalCharges" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Quotation" ADD COLUMN "discount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "Quotation" ADD COLUMN "tax" DECIMAL(10,2) NOT NULL DEFAULT 0;

ALTER TABLE "Quotation" ADD COLUMN "finalAmount" DECIMAL(10,2);
UPDATE "Quotation" SET "finalAmount" = "amount" WHERE "finalAmount" IS NULL;
ALTER TABLE "Quotation" ALTER COLUMN "finalAmount" SET NOT NULL;

ALTER TABLE "Quotation" RENAME COLUMN "notes" TO "description";
ALTER TABLE "Quotation" ADD COLUMN "details" TEXT;

ALTER TABLE "Quotation" DROP COLUMN "amount";

-- CreateIndex
CREATE INDEX "Quotation_eventRequestId_idx" ON "Quotation"("eventRequestId");
