import { firestore } from 'firebase-admin';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UserFeedbackDTO } from '@growiary/types';
import { v4 as uuidv4 } from 'uuid';
import { dateConverter } from '../utils';

@Injectable()
export class FeedbackService {
  constructor(@Inject(REQUEST) private readonly request: { user: any }) {}

  async findUserFeedback() {
    try {
      const { userId } = this.request.user;

      const userFeedbackRef = firestore().collection('feedback').doc(userId);
      const userFeedbackDoc = await userFeedbackRef.get();

      if (userFeedbackDoc.exists) {
        const userFeedbackData = userFeedbackDoc.data();

        const feedbackArray = Object.keys(userFeedbackData).map(feedbackId => ({
          ...userFeedbackData[feedbackId],
          feedbackId: feedbackId,
          createAt: dateConverter(userFeedbackData[feedbackId].createAt),
          updateAt: dateConverter(userFeedbackData[feedbackId].updateAt),
        }));

        return { status: 200, data: feedbackArray };
      }

      return { status: 404, message: 'User feedback not found' };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  async createUserFeedback(userFeedbackDTO: UserFeedbackDTO) {
    const { feedback, content } = userFeedbackDTO;

    try {
      const { userId } = this.request.user;

      const userFeedbackRef = firestore().collection('feedback').doc(userId);

      const feedbackId = uuidv4();

      const userFeedbackData = {
        [feedbackId]: {
          createAt: new Date(),
          updateAt: new Date(),
          feedback,
          content,
        },
      };

      await userFeedbackRef.set(userFeedbackData, { merge: true });

      return { status: 200, data: userFeedbackData };
    } catch (error) {
      throw error;
    }
  }
}
