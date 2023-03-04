import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  offset = 0;

  @IsOptional()
  @IsNumber()
  limit = 30;
}
