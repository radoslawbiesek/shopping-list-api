import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

const ORDER_BY = ['last_used', '-last_used', 'name', '-name'] as const;

export class GetAllProductsQuery {
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

export class CreateProductDto {
  @MaxLength(25)
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsOptional()
  public description!: string;

  @IsUrl()
  @IsOptional()
  public image!: string;

  @IsInt()
  @IsNotEmpty()
  public category_id!: number;
}
