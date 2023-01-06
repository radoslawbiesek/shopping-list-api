import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public password!: string;
}
