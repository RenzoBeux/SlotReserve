import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  slug?: string;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiPropertyOptional()
  logo?: string;

  @ApiPropertyOptional()
  primaryColor?: string;

  @ApiPropertyOptional()
  secondaryColor?: string;
}
