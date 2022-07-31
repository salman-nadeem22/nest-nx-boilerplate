import { SetMetadata } from '@nestjs/common';
import { projectConstants } from '@do-business/constants';

export const Public = () => SetMetadata('public', true);
export const RolesAllowed = (...roles: projectConstants.Role[]) => SetMetadata('roles', roles);
