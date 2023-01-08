import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

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
