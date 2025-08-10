-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "isCover" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE INDEX "Media_productId_idx" ON "Media"("productId");

-- CreateIndex
CREATE INDEX "Media_variantId_idx" ON "Media"("variantId");

-- CreateIndex
CREATE INDEX "Media_isCover_idx" ON "Media"("isCover");

