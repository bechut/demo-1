import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('FIREBASE_ADMIN') private fba: any,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const Public = this.reflector.get<string[]>('Public', context.getHandler());
    if (Public) {
      return true;
    }
    const request: any = context.switchToHttp().getRequest();
    const idToken = request.headers.authorization?.split(' ')[1];
    if (!idToken) throw new UnauthorizedException('Mission token');

    const res = await this.fba
      .auth()
      .verifyIdToken(idToken)
      .catch((e) => {
        console.log(e);
        throw new UnauthorizedException(e.message);
      });

    request.user = res;
    return res;
  }
}
