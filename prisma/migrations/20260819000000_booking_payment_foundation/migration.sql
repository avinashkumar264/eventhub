-- AlterTable: Razorpay gateway fields for idempotent order/webhook handling.
ALTER TABLE "Payment" ADD COLUMN "razorpayOrderId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "razorpayPaymentId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "razorpaySignature" TEXT;

-- CreateIndex (unique -> a given gateway order/payment id can only ever
-- back one Payment row, which is what makes webhook replay a no-op)
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");
