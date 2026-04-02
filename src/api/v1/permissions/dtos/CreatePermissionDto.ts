import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]+(\.[a-z]+)*$/, {
    message: 'Code must be in lowercase dot-separated format (e.g. global.permissions.create)',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
