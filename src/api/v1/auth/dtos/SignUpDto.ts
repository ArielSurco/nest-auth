import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsStrongPassword()
  password: string;

  @IsEmail()
  email: string;
}
