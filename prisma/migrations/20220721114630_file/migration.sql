/*
  Warnings:

  - You are about to drop the column `url` on the `ProductMedia` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `ProductMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductMedia" DROP COLUMN "url",
ADD COLUMN     "fileId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "profilePicture",
ADD COLUMN     "profilePictureId" INTEGER;

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Seller" ADD CONSTRAINT "Seller_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMedia" ADD CONSTRAINT "ProductMedia_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
