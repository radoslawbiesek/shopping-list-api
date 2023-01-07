import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @MaxLength(25)
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsInt()
  @IsOptional()
  public parent_id!: number;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  public photo!: string;
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
