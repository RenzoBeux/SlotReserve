import { ApiProperty } from '@nestjs/swagger';
import { CreateAvailabilityDto } from './create-availability.dto';

export class UpdateAvailabilityDto extends CreateAvailabilityDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
}
