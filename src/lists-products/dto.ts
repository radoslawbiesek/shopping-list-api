import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateListProductParams {
  @Transform(({ value }) => Number(value))
  @IsInt()
  list_id!: number;
}

export class CreateListProductDto {
  @IsInt()
  @IsNotEmpty()
  product_id!: number;
}
