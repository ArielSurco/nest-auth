import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z]+(\.[a-z]+)*$/, {
    message:
      'Code must be in lowercase dot-separated format (e.g. global.roles.admin)',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionIds: string[];
}
