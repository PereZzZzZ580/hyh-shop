-- DropForeignKey
ALTER TABLE "public"."ProductLog" DROP CONSTRAINT "ProductLog_productId_fkey";

-- AlterTable
ALTER TABLE "public"."ProductLog" ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ProductLog" ADD CONSTRAINT "ProductLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
