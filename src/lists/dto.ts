import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateListDto {
  @MaxLength(25)
  @IsString()
  @IsNotEmpty()
  public name!: string;
}
