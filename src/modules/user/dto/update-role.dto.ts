import { RoleName } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsEnum(RoleName, { message: 'Role name must be a valid value' })
  roleName: RoleName;
}
