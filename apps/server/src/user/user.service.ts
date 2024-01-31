import { firestore } from 'firebase-admin';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { UserProfileDTO, UserProfileUpdateDTO } from '@growiary/types';
import { dateConverter } from '../utils';

@Injectable()
export class UserService {
  constructor(@Inject(REQUEST) private readonly request: { user: any }) {}

  async findUser() {
    try {
      const { userId } = this.request.user;

      const userDoc = await firestore().collection('users').doc(userId).get();

      const profileDoc = await firestore().collection('profile').doc(userId).get();

      if (!userDoc.exists || !profileDoc.exists) {
        return { status: 404, message: 'User or profile not found' };
      }

      const userData = userDoc.data();
      const profileData = profileDoc.data();

      // date converter
      const createAt = profileData.createdAt;
      const updateAt = profileData.updatedAt;

      const convertedCreateAt = dateConverter(createAt);
      const convertedUpdateAt = dateConverter(updateAt);

      profileData.createdAt = convertedCreateAt;
      profileData.updatedAt = convertedUpdateAt;

      const data = {
        user: userData,
        profile: profileData,
      };

      return { status: 200, data };
    } catch (error) {
      throw error;
    }
  }

  async createUserProfile(userProfileDTO: UserProfileDTO) {
    try {
      const { userId } = this.request.user;

      const userProfileRef = firestore().collection('profile').doc(userId);

      if (!userProfileDTO.agreeTerms || !userProfileDTO.userName) {
        return { status: 400, message: 'agreeTerms or userName is empty' };
      }

      const userProfiledata = {
        agreeTerms: userProfileDTO.agreeTerms,
        userName: userProfileDTO.userName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await userProfileRef.set(userProfiledata, { merge: true });

      return { status: 200, data: userProfiledata };
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userProfileUpdateDTO: UserProfileUpdateDTO) {
    try {
      const { userId } = this.request.user;

      const userProfileRef = firestore().collection('profile').doc(userId);

      if (!userProfileUpdateDTO.agreeTerms && !userProfileUpdateDTO.userName) {
        return { status: 400, message: 'No fields to update' };
      }

      const userProfiledata: { [key: string]: any } = {
        updatedAt: new Date(),
      };

      if (userProfileUpdateDTO.agreeTerms !== undefined) {
        userProfiledata.agreeTerms = userProfileUpdateDTO.agreeTerms;
      }

      if (userProfileUpdateDTO.userName !== undefined) {
        userProfiledata.userName = userProfileUpdateDTO.userName;
      }

      await userProfileRef.update(userProfiledata);

      return { status: 200, data: userProfiledata };
    } catch (error) {
      throw error;
    }
  }
}
