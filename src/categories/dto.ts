import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @MaxLength(25)
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsInt()
  @IsOptional()
  public parent_id!: number;
}
