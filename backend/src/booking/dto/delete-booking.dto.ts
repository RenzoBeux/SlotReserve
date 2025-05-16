import { ApiProperty } from '@nestjs/swagger';

export class DeleteBookingDto {
  @ApiProperty()
  id: string;
}
