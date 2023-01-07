import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @MaxLength(50)
  @IsEmail()
  @IsNotEmpty()
  public email!: string;

  @MaxLength(25)
  @MinLength(4)
  @IsString()
  @IsNotEmpty()
  public username!: string;

  @MaxLength(16)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
