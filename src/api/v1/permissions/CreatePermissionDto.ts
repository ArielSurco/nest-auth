import { IsNotEmpty, IsString, IsUppercase, Matches } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Matches(/^[A-Z_]+$/, {
    message: 'Code must be in uppercase and underscore separated',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
