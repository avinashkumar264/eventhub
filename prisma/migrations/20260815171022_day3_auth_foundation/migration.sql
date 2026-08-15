/*
  Warnings:

  - The values [PENDING_PAYMENT,REFUNDED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [VIEWED,RESPONDED,QUOTED,WON,EXPIRED] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REVIEW,SUBSCRIPTION,SUPPORT] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREATED,SUCCESS,PARTIALLY_REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PLATFORM_FEE,SUBSCRIPTION] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUBMITTED,REJECTED,WITHDRAWN] on the enum `QuotationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `entity` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedAt` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `contactUnlocked` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `contactUnlockedAt` on the `Booking` table. All the data in the column will be lost.
  - You are about to alter the column `advanceAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to alter the column `totalAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `isUnlocked` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `unlockedAt` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `venue` on the `Event` table. All the data in the column will be lost.
  - You are about to alter the column `budgetMin` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to alter the column `budgetMax` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `eventId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `attachmentUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gateway` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayOrderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayPaymentId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `gatewaySignature` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `address` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `gstNumber` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `panNumber` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioUrl` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `advanceAmount` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Service` table. All the data in the column will be lost.
  - You are about to alter the column `basePrice` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(10,2)`.
  - You are about to drop the column `endDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `eventsCompleted` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `eventsGuaranteed` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `durationDays` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `guaranteedEvents` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `leadAccess` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `SubscriptionPlan` table. All the data in the column will be lost.
  - The `status` column on the `SupportTicket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `EventService` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventRequestId,providerId]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entityType` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `entityId` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `eventDate` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `eventRequestId` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payerId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Made the column `bookingId` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `amount` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventRequestId` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceMonthly` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FreelancerSpecialty" AS ENUM ('PHOTOGRAPHY', 'MEHENDI', 'DESIGNING', 'MAKEUP', 'FACIAL', 'DECORATION', 'CATERING', 'OTHER');

-- CreateEnum
CREATE TYPE "EventRequestStatus" AS ENUM ('OPEN', 'MATCHED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConversationChannel" AS ENUM ('OPERATIONS_MEDIATED', 'DIRECT');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST');
ALTER TABLE "public"."Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "public"."LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('LEAD', 'QUOTATION', 'BOOKING', 'PAYMENT', 'MESSAGE', 'SYSTEM');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'REFUNDED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('ADVANCE', 'BALANCE', 'FULL', 'REFUND');
ALTER TABLE "Payment" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "public"."PaymentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QuotationStatus_new" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED');
ALTER TABLE "public"."Quotation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Quotation" ALTER COLUMN "status" TYPE "QuotationStatus_new" USING ("status"::text::"QuotationStatus_new");
ALTER TYPE "QuotationStatus" RENAME TO "QuotationStatus_old";
ALTER TYPE "QuotationStatus_new" RENAME TO "QuotationStatus";
DROP TYPE "public"."QuotationStatus_old";
ALTER TABLE "Quotation" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('TRIAL', 'ACTIVE', 'EXPIRED', 'CANCELLED');
ALTER TABLE "public"."Subscription" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Subscription" ALTER COLUMN "status" TYPE "SubscriptionStatus_new" USING ("status"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "public"."SubscriptionStatus_old";
ALTER TABLE "Subscription" ALTER COLUMN "status" SET DEFAULT 'TRIAL';
COMMIT;

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_providerId_fkey";

-- DropForeignKey
ALTER TABLE "EventService" DROP CONSTRAINT "EventService_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventService" DROP CONSTRAINT "EventService_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Lead" DROP CONSTRAINT "Lead_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "AuditLog_action_idx";

-- DropIndex
DROP INDEX "AuditLog_createdAt_idx";

-- DropIndex
DROP INDEX "AuditLog_entity_entityId_idx";

-- DropIndex
DROP INDEX "AuditLog_userId_idx";

-- DropIndex
DROP INDEX "Booking_eventId_key";

-- DropIndex
DROP INDEX "Conversation_isUnlocked_idx";

-- DropIndex
DROP INDEX "Conversation_type_idx";

-- DropIndex
DROP INDEX "Event_city_idx";

-- DropIndex
DROP INDEX "Event_eventDate_idx";

-- DropIndex
DROP INDEX "Event_providerId_idx";

-- DropIndex
DROP INDEX "Event_status_idx";

-- DropIndex
DROP INDEX "Lead_eventId_providerId_key";

-- DropIndex
DROP INDEX "Lead_expiresAt_idx";

-- DropIndex
DROP INDEX "Message_createdAt_idx";

-- DropIndex
DROP INDEX "Message_senderId_idx";

-- DropIndex
DROP INDEX "Notification_createdAt_idx";

-- DropIndex
DROP INDEX "Notification_isRead_idx";

-- DropIndex
DROP INDEX "Payment_gatewayPaymentId_idx";

-- DropIndex
DROP INDEX "Payment_userId_idx";

-- DropIndex
DROP INDEX "Provider_city_idx";

-- DropIndex
DROP INDEX "Provider_gstNumber_key";

-- DropIndex
DROP INDEX "Provider_panNumber_key";

-- DropIndex
DROP INDEX "Provider_status_idx";

-- DropIndex
DROP INDEX "Quotation_customerId_idx";

-- DropIndex
DROP INDEX "Quotation_eventId_idx";

-- DropIndex
DROP INDEX "Review_rating_idx";

-- DropIndex
DROP INDEX "Subscription_endDate_idx";

-- DropIndex
DROP INDEX "Subscription_planId_idx";

-- DropIndex
DROP INDEX "Subscription_userId_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "entity",
DROP COLUMN "ipAddress",
DROP COLUMN "userAgent",
DROP COLUMN "userId",
ADD COLUMN     "actorId" TEXT,
ADD COLUMN     "entityType" TEXT NOT NULL,
ALTER COLUMN "entityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "cancelledAt",
DROP COLUMN "completedAt",
DROP COLUMN "confirmedAt",
DROP COLUMN "contactUnlocked",
DROP COLUMN "contactUnlockedAt",
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "advanceAmount" DROP NOT NULL,
ALTER COLUMN "advanceAmount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "isUnlocked",
DROP COLUMN "type",
DROP COLUMN "unlockedAt",
ADD COLUMN     "channel" "ConversationChannel" NOT NULL DEFAULT 'OPERATIONS_MEDIATED',
ADD COLUMN     "eventRequestId" TEXT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "description",
DROP COLUMN "providerId",
DROP COLUMN "state",
DROP COLUMN "status",
DROP COLUMN "venue",
ALTER COLUMN "eventDate" SET NOT NULL,
ALTER COLUMN "budgetMin" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "budgetMax" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "eventId",
DROP COLUMN "expiresAt",
DROP COLUMN "serviceId",
DROP COLUMN "source",
ADD COLUMN     "eventRequestId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "attachmentUrl",
DROP COLUMN "content",
DROP COLUMN "createdAt",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "isRead",
DROP COLUMN "message",
ADD COLUMN     "body" TEXT,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "currency",
DROP COLUMN "gateway",
DROP COLUMN "gatewayOrderId",
DROP COLUMN "gatewayPaymentId",
DROP COLUMN "gatewaySignature",
DROP COLUMN "userId",
ADD COLUMN     "method" TEXT,
ADD COLUMN     "payerId" TEXT NOT NULL,
ADD COLUMN     "transactionRef" TEXT,
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ALTER COLUMN "bookingId" SET NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "address",
DROP COLUMN "description",
DROP COLUMN "email",
DROP COLUMN "gstNumber",
DROP COLUMN "isVerified",
DROP COLUMN "panNumber",
DROP COLUMN "phone",
DROP COLUMN "pincode",
DROP COLUMN "portfolioUrl",
DROP COLUMN "state",
DROP COLUMN "status",
DROP COLUMN "website",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "freelancerSpecialty" "FreelancerSpecialty",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "advanceAmount",
DROP COLUMN "customerId",
DROP COLUMN "eventId",
DROP COLUMN "totalAmount",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "eventRequestId" TEXT NOT NULL,
ADD COLUMN     "leadId" TEXT;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "customerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "isActive",
DROP COLUMN "name",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "basePrice" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "endDate",
DROP COLUMN "eventsCompleted",
DROP COLUMN "eventsGuaranteed",
DROP COLUMN "startDate",
DROP COLUMN "userId",
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'TRIAL';

-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "durationDays",
DROP COLUMN "guaranteedEvents",
DROP COLUMN "isActive",
DROP COLUMN "leadAccess",
DROP COLUMN "price",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "guaranteedBookingsPerMonth" INTEGER,
ADD COLUMN     "leadCreditsPerMonth" INTEGER,
ADD COLUMN     "priceMonthly" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "SupportTicket" ADD COLUMN     "priority" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "isActive",
DROP COLUMN "phoneVerified",
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

-- DropTable
DROP TABLE "EventService";

-- DropEnum
DROP TYPE "ConversationType";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "ProviderStatus";

-- DropEnum
DROP TYPE "TicketStatus";

-- CreateTable
CREATE TABLE "EventRequest" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceId" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "status" "EventRequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventRequest_customerId_idx" ON "EventRequest"("customerId");

-- CreateIndex
CREATE INDEX "EventRequest_status_idx" ON "EventRequest"("status");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_eventRequestId_providerId_key" ON "Lead"("eventRequestId", "providerId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Provider_verified_idx" ON "Provider"("verified");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRequest" ADD CONSTRAINT "EventRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_eventRequestId_fkey" FOREIGN KEY ("eventRequestId") REFERENCES "EventRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
