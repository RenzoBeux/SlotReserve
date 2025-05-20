import { ApiProperty } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @ApiProperty()
  weekday: number;

  @ApiProperty({ description: 'ISO string (date and time)' })
  startTime: string;

  @ApiProperty({ description: 'ISO string (date and time)' })
  endTime: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  maxBookings: number;

  @ApiProperty()
  bookingMode: 'FIXED' | 'FLEXIBLE';
}
