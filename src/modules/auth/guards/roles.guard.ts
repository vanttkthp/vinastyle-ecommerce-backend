import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES } from '../../../decorators/roles.decorator';
import { RequestWithUser } from '../../../types/request.type';


@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles: number[] = this.reflector.getAllAndOverride(ROLES, [
			context.getHandler(),
			context.getClass(),
		]);
		const request: RequestWithUser = context.switchToHttp().getRequest();
           if (!roles.includes(request.user.roleId as unknown as number)) {
            throw new ForbiddenException({
              message: 'You are not authorized to access this resource',
            });
          }
      
          return true;
	}
}
