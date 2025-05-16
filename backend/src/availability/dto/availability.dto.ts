import { AvailabilitySlot } from '@prisma/client';

export type AvailabilityDto = AvailabilitySlot & {
  id: string;
};
