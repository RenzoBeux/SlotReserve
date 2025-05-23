import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, Booking } from '@prisma/client';

@Injectable()
export class BookingService {
  private prisma = new PrismaClient();

  async getMine(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { owner: true },
    });
  }

  async create(
    userId: string,
    data: Omit<Booking, 'id' | 'userId'>,
  ): Promise<Booking> {
    // Check if the availability slot exists
    const availabilitySlot = await this.prisma.availabilitySlot.findUnique({
      where: { id: data.availabilitySlotId },
    });

    if (!availabilitySlot) {
      throw new NotFoundException('Availability slot not found');
    }

    // Check the current number of bookings for this slot
    const currentBookings = await this.prisma.booking.count({
      where: { availabilitySlotId: data.availabilitySlotId },
    });

    if (currentBookings >= availabilitySlot.maxBookings) {
      throw new BadRequestException('Maximum bookings reached for this slot');
    }

    // Validate booking according to bookingMode
    if (availabilitySlot.bookingMode === 'FIXED') {
      // Must match slot exactly (compare only time part)
      const slotStart = `${data.startTime}`.slice(11, 16);
      const slotEnd = `${data.endTime}`.slice(11, 16);
      if (
        slotStart !== availabilitySlot.startTime ||
        slotEnd !== availabilitySlot.endTime
      ) {
        throw new BadRequestException(
          'Booking must match slot times for FIXED mode',
        );
      }
    } else if (availabilitySlot.bookingMode === 'FLEXIBLE') {
      // Must be inside slot range (compare only time part)
      const slotStart = `${data.startTime}`.slice(11, 16);
      const slotEnd = `${data.endTime}`.slice(11, 16);
      if (
        !this.isTimeInRange(
          slotStart,
          availabilitySlot.startTime,
          availabilitySlot.endTime,
        ) ||
        !this.isTimeInRange(
          slotEnd,
          availabilitySlot.startTime,
          availabilitySlot.endTime,
        ) ||
        slotStart >= slotEnd
      ) {
        throw new BadRequestException(
          'Booking must be inside slot range for FLEXIBLE mode',
        );
      }
      // Check for overlap with existing bookings in this slot
      const overlapping = await this.isOverlappingBooking(
        data.availabilitySlotId,
        data.startTime,
        data.endTime,
      );
      if (overlapping) {
        throw new BadRequestException(
          'Booking overlaps with an existing booking',
        );
      }
    }

    // Proceed to create the booking
    return this.prisma.booking.create({
      data: { ...data, userId },
    });
  }

  /**
   * Returns true if the given time range overlaps with any existing booking in the same slot
   */
  async isOverlappingBooking(
    availabilitySlotId: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const overlapping = await this.prisma.booking.findFirst({
      where: {
        availabilitySlotId,
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        ],
      },
    });
    return !!overlapping;
  }

  /**
   * Returns true if time >= rangeStart and time <= rangeEnd
   */
  isTimeInRange(time: string, rangeStart: string, rangeEnd: string): boolean {
    return time >= rangeStart && time <= rangeEnd;
  }

  async delete(userId: string, id: string): Promise<void> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.userId !== userId)
      throw new ForbiddenException('Not found or forbidden');
    await this.prisma.booking.delete({ where: { id } });
  }
}
