import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

const ORDER_BY = ['last_used', '-last_used', 'name', '-name'] as const;

export class ProductsQueryParams {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  offset?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit?: string;

  @IsOptional()
  @IsEnum(ORDER_BY, {
    message: 'order_by must be one of the following values: ' + ORDER_BY.join(', '),
  })
  order_by?: typeof ORDER_BY[number];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  category_id?: string;
}
