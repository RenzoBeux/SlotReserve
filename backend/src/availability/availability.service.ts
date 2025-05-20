import { Injectable } from '@nestjs/common';
import { PrismaClient, AvailabilitySlot } from '@prisma/client';

@Injectable()
export class AvailabilityService {
  async createBulk(
    userId: string,
    data: Omit<AvailabilitySlot, 'id' | 'userId'>[],
  ): Promise<AvailabilitySlot[]> {
    // Map each slot to include the userId
    const slotsData = data.map((slot) => ({ ...slot, userId }));
    // Use Prisma's createMany for bulk insert
    // Note: createMany does not return the created records, so we fetch them after insert
    await this.prisma.availabilitySlot.createMany({ data: slotsData });
    // Fetch the newly created slots for this user (could be optimized if needed)
    // For simplicity, return all slots for the user
    return this.prisma.availabilitySlot.findMany({ where: { userId } });
  }
  private prisma = new PrismaClient();

  async getMine(userId: string): Promise<AvailabilitySlot[]> {
    return this.prisma.availabilitySlot.findMany({ where: { userId } });
  }

  async create(
    userId: string,
    data: Omit<AvailabilitySlot, 'id' | 'userId'>,
  ): Promise<AvailabilitySlot> {
    if (
      !isValidISODateTime(data.startTime) ||
      !isValidISODateTime(data.endTime)
    ) {
      throw new Error(
        'startTime and endTime must be valid ISO date-time strings',
      );
    }
    return this.prisma.availabilitySlot.create({
      data: { ...data, userId },
    });
  }

  async update(
    userId: string,
    slot: AvailabilitySlot,
  ): Promise<AvailabilitySlot> {
    // Only allow update if the slot belongs to the user
    const found = await this.prisma.availabilitySlot.findUnique({
      where: { id: slot.id },
    });
    if (!found || found.userId !== userId)
      throw new Error('Not found or forbidden');
    if (
      !isValidISODateTime(slot.startTime) ||
      !isValidISODateTime(slot.endTime)
    ) {
      throw new Error(
        'startTime and endTime must be valid ISO date-time strings',
      );
    }
    return this.prisma.availabilitySlot.update({
      where: { id: slot.id },
      data: slot,
    });
  }

  async delete(userId: string, id: string): Promise<void> {
    const found = await this.prisma.availabilitySlot.findUnique({
      where: { id },
    });
    if (!found || found.userId !== userId)
      throw new Error('Not found or forbidden');

    await this.prisma.availabilitySlot.delete({ where: { id } });
  }
}

// Helper for ISO string validation
// Accepts only full ISO date-time strings (e.g., 2025-05-19T09:00:00.000Z)
// Returns true if valid, false otherwise
function isValidISODateTime(str: string): boolean {
  // ISO 8601 regex (basic, not exhaustive)
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?Z?$/;
  return (
    typeof str === 'string' && isoRegex.test(str) && !isNaN(Date.parse(str))
  );
}
