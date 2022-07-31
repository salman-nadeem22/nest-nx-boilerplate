import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class ResetAuthGuard extends AuthGuard('reset') {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {}
