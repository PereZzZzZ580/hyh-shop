-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_productId_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "bytes" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "isCover" BOOLEAN DEFAULT false,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "position" INTEGER,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "variantId" TEXT,
ADD COLUMN     "width" INTEGER,
ALTER COLUMN "sort" DROP NOT NULL,
ALTER COLUMN "sort" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "city" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "Address_isDefault_idx" ON "Address"("isDefault");

-- CreateIndex
CREATE INDEX "Media_productId_idx" ON "Media"("productId");

-- CreateIndex
CREATE INDEX "Media_variantId_idx" ON "Media"("variantId");

-- CreateIndex
CREATE INDEX "Media_isCover_idx" ON "Media"("isCover");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");

-- CreateIndex
CREATE INDEX "Product_targetGender_idx" ON "Product"("targetGender");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_hairType_idx" ON "Product" USING GIN ("hairType");

-- CreateIndex
CREATE INDEX "Variant_price_idx" ON "Variant"("price");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
