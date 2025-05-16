import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  ownerId: string;

  @ApiPropertyOptional()
  note?: string;

  @ApiProperty()
  availabilitySlotId: string;
}
