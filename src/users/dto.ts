import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @MaxLength(16)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
