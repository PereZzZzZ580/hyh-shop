-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'WHATSAPP');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'COD';
