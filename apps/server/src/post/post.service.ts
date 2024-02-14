import { CreatePostDTO, FeedbackType, FilterFindPostDTO } from '@growiary/types';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { firestore } from 'firebase-admin';
import { dateConverter, dataFromOpenAIResult } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { OpenAiService } from '../open-ai/open-ai.service';

@Injectable()
export class PostService {
  constructor(
    @Inject(REQUEST) private readonly request: { user: any },
    private readonly openAiService: OpenAiService,
  ) {}

  /**
   * user의 모든 post를 가져온다.
   * @returns user posts
   */
  async findPost() {
    const { userId } = this.request.user;
    const userPostRef = firestore().collection('posts').doc(userId);

    try {
      const userPostsSnapshot = await userPostRef.get();

      if (userPostsSnapshot.exists) {
        const userPostsData = userPostsSnapshot.data();

        const postsArray = Object.keys(userPostsData).map(postId => ({
          postId,
          feedback: 'NONE',
          ...userPostsData[postId],
          createAt: dateConverter(userPostsData[postId].createAt),
          updateAt: dateConverter(userPostsData[postId].updateAt),
        }));

        return { status: 200, data: postsArray };
      } else {
        return { status: 200, data: [] };
      }
    } catch (error) {
      console.error("Error fetching user's posts:", error);
      return { status: 500, error: 'Internal Server Error' };
    }
  }

  /**
   * 유저의 post를 필터링하여 가져온다.
   * @param filterFindPostDTO (startDate <= 값 < endDate)
   * @returns 필터링된 user posts
   */
  async filterFindPost(filterFindPostDTO: FilterFindPostDTO) {
    const { startDate, endDate } = filterFindPostDTO;
    const { userId } = this.request.user;
    const userPostRef = firestore().collection('posts').doc(userId);

    const userPostsDoc = await userPostRef.get();
    const userPostsData = userPostsDoc.data();

    const filteredPosts = [];

    Object.keys(userPostsData).forEach(postId => {
      const post = userPostsData[postId];

      const createAtDate = dateConverter(post.createAt);
      const updateAtDate = dateConverter(post.updateAt);

      const startDateUTC = new Date(startDate);
      startDateUTC.setHours(startDateUTC.getHours() - 9);
      const endDateUTC = new Date(endDate);
      endDateUTC.setHours(endDateUTC.getHours() - 9);

      if (createAtDate >= startDateUTC && createAtDate < endDateUTC) {
        filteredPosts.push({
          postId: postId,
          feedback: 'NONE',
          ...post,
          createAt: createAtDate,
          updateAt: updateAtDate,
        });
      }
    });

    return { status: 200, data: filteredPosts };
  }

  /**
   * 유저 post작성
   * @param createPostDTO 유저가 작성한 post
   * @returns post 작성 결과
   */
  async createPost(createPostDTO: CreatePostDTO) {
    const { userId } = this.request.user;

    const userPostRef = firestore().collection('posts').doc(userId);

    const postId = uuidv4();

    const data = {
      [postId]: {
        ...createPostDTO,
        feedback: 'NONE',
        createAt: new Date(),
        updateAt: new Date(),
      },
    };

    await userPostRef.set(data, { merge: true });

    const returnData = {
      postId,
      ...data[postId],
    };

    return { status: 200, data: returnData };
  }

  /**
   * AI답변이 포함된 유저 post작성
   * @param createPostDTO 유저가 작성한 post
   * @returns post 작성 결과
   */
  async createPostWithOpenAI(createPostDTO: CreatePostDTO) {
    const { userId } = this.request.user;

    const userPostRef = firestore().collection('posts').doc(userId);

    const postId = uuidv4();

    const aiAnswer = await this.openAiService.requestGrowiaryAI(
      createPostDTO.content,
      createPostDTO.template,
    );

    const { id, created, usage, content } = dataFromOpenAIResult(aiAnswer.message);

    const data = {
      [postId]: {
        ...createPostDTO,
        answer: content,
        ai: {
          id,
          created,
          usage,
        },
        feedback: 'NONE',
        createAt: new Date(),
        updateAt: new Date(),
      },
    };

    await userPostRef.set(data, { merge: true });

    const returnData = {
      postId,
      ...data[postId],
    };

    return { status: 200, data: returnData };
  }

  async postFeedback(postId: string, feedback: FeedbackType) {
    const { userId } = this.request.user;
    try {
      const userPostRef = firestore().collection('posts').doc(userId);
      const userPostsSnapshot = await userPostRef.get();
      if (userPostsSnapshot.exists) {
        const userPostsData = userPostsSnapshot.data();

        if (userPostsData[postId]) {
          userPostsData[postId].feedback = feedback;

          await userPostRef.set(userPostsData, { merge: true });

          return { status: 200, message: 'Feedback added successfully' };
        } else {
          return { status: 404, message: 'Post not found for the user' };
        }
      } else {
        return { status: 404, message: 'User has no posts' };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }
}
