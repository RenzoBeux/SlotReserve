import { ApiProperty } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @ApiProperty()
  weekday: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  label: string;

  @ApiProperty()
  maxBookings: number;

  @ApiProperty()
  bookingMode: 'FIXED' | 'FLEXIBLE';
}
