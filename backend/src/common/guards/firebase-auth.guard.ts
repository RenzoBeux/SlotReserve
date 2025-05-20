import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';

export interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
  };
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }
    const idToken = authHeader.split(' ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      (request as AuthenticatedRequest).user = { uid: decodedToken.uid };
      return true;
    } catch (e) {
      console.error('Firebase ID token verification failed:', e);
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }
}
