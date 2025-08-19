-- DropForeignKey
ALTER TABLE "public"."ProductLog" DROP CONSTRAINT "ProductLog_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductLog" DROP CONSTRAINT "ProductLog_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ProductLog" ADD CONSTRAINT "ProductLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductLog" ADD CONSTRAINT "ProductLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
