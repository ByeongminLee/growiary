import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userID = request.headers['authorization'];

    if (!userID) {
      console.log('userID 값이 없습니다.');
      return false;
    }

    try {
      const userSnapshot = await admin.firestore().collection('users').doc(userID).get();
      const userData = userSnapshot.data();

      if (!userData) {
        console.log('조회된 user Data 값이 없습니다.');
        return false;
      }

      request.user = {
        userId: userID,
        userData,
      };
      return true;
    } catch (error) {
      console.log('AuthGuard Error', error);
      return false;
    }
  }
}
