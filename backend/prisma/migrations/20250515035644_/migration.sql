/*
  Warnings:

  - Added the required column `maxBookings` to the `AvailabilitySlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilitySlotId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvailabilitySlot" ADD COLUMN     "maxBookings" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "availabilitySlotId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_availabilitySlotId_fkey" FOREIGN KEY ("availabilitySlotId") REFERENCES "AvailabilitySlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
