import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  startTime: string; // ISO string (date and time)

  @ApiProperty()
  endTime: string; // ISO string (date and time)

  @ApiProperty()
  ownerId: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  availabilitySlotId: string;
}
