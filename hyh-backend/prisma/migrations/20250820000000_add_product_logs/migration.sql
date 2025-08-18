-- CreateTable
CREATE TABLE "ProductLog" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductLog_productId_idx" ON "ProductLog"("productId");

-- CreateIndex
CREATE INDEX "ProductLog_userId_idx" ON "ProductLog"("userId");

-- AddForeignKey
ALTER TABLE "ProductLog" ADD CONSTRAINT "ProductLog_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLog" ADD CONSTRAINT "ProductLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
