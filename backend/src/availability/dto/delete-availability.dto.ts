import { ApiProperty } from '@nestjs/swagger';

export class DeleteAvailabilityDto {
  @ApiProperty()
  id: string;
}
