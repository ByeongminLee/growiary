import {
  CreatePostDTO,
  FilterFindPostDTO,
  PostEditDTO,
  PostFeedbackDTO,
} from '@growiary/types';
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
   * date에 offset을 더하거나 뺀다.
   * @param date 날짜
   * @param offset offset
   * @returns offset이 적용된 날짜
   */
  private async dateOffset({
    date,
    offset,
  }: {
    date?: string | Date;
    offset?: string | number;
  }): Promise<Date | null> {
    if (!date) {
      return new Date();
    }

    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }

    if (offset) {
      const offsetMinutes = typeof offset === 'string' ? parseInt(offset) : offset;
      dateObj.setMinutes(dateObj.getMinutes() + offsetMinutes);
    }

    return dateObj;
  }

  /**
   * 유저 post를 검색 및 firebase reference를 반환
   * @returns 검색된 post 및 firebase reference
   */
  private async getUserPostRef() {
    const { userId } = this.request.user;
    const userPostRef = firestore().collection('posts').doc(userId);
    const userPostDoc = await userPostRef.get();

    if (userPostDoc.exists) {
      return { isPosts: true, userId, userPostRef };
    }

    return { isPosts: false, userId, userPostRef };
  }

  /**
   * user의 모든 post를 가져온다.
   * @returns user posts
   */
  async findPost() {
    const { userPostRef } = await this.getUserPostRef();

    try {
      const userPostsSnapshot = await userPostRef.get();

      if (userPostsSnapshot.exists) {
        const userPostsData = userPostsSnapshot.data();

        const postsArray = Object.keys(userPostsData)
          .filter(postId => userPostsData[postId].status !== 'DELETED')
          .map(postId => ({
            postId,
            feedback: 'NONE',
            ...userPostsData[postId],
            status: userPostsData[postId].hasOwnProperty('status')
              ? userPostsData[postId].status
              : 'ACTIVE',
            createAt: dateConverter(userPostsData[postId].createAt),
            updateAt: dateConverter(userPostsData[postId].updateAt),
            selectedAt: dateConverter(userPostsData[postId].selectedAt),
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
    const { startDate, endDate, offset } = filterFindPostDTO;
    const { isPosts, userPostRef } = await this.getUserPostRef();

    if (!isPosts) {
      return { status: 200, data: [] };
    }

    const userPostsDoc = await userPostRef.get();
    const userPostsData = userPostsDoc.data();

    const filteredPosts = [];

    const _offset = offset ? Number(offset) : -540;
    const startDateUTC = new Date(startDate);
    startDateUTC.setMinutes(startDateUTC.getMinutes() + _offset);
    const endDateUTC = new Date(endDate);
    endDateUTC.setMinutes(endDateUTC.getMinutes() + _offset);

    console.log(
      'start:',
      startDate,
      startDateUTC,
      '\n',
      'end:',
      endDate,
      endDateUTC,
      '\noffset:',
      offset,
    );

    for (const postId of Object.keys(userPostsData)) {
      const post = userPostsData[postId];
      if (post.status !== 'DELETED') {
        const writingDate = post.selectedAt ? post.selectedAt : post.createAt;
        const date = writingDate?._seconds ? dateConverter(writingDate) : writingDate;

        // const date = await this.dateOffset({
        //   date: writingDate?._seconds ? dateConverter(writingDate) : writingDate,
        //   offset,
        // });

        if (date >= startDateUTC && date < endDateUTC) {
          filteredPosts.push({
            postId: postId,
            feedback: 'NONE',
            status: userPostsData[postId].hasOwnProperty('status')
              ? userPostsData[postId].status
              : 'ACTIVE',
            ...post,
            createAt: dateConverter(post.createAt),
            updateAt: dateConverter(post.updateAt),
            selectedAt: writingDate?._seconds ? dateConverter(writingDate) : writingDate,
          });
        }
      }
    }

    if (filteredPosts.length === 0) {
      return { status: 200, data: [] };
    }

    return { status: 200, data: filteredPosts };
  }

  /**
   * 유저 post작성
   * @param createPostDTO 유저가 작성한 post
   * @returns post 작성 결과
   */
  async createPost(createPostDTO: CreatePostDTO) {
    const { userPostRef } = await this.getUserPostRef();

    const postId = uuidv4();

    // const date = await this.dateOffset({
    //   date: createPostDTO.date,
    //   offset: createPostDTO.offset,
    // });

    const data = {
      [postId]: {
        ...createPostDTO,
        feedback: 'NONE',
        createAt: new Date(),
        updateAt: new Date(),
        selectedAt: new Date(createPostDTO.date),
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
    const { userPostRef } = await this.getUserPostRef();

    const postId = uuidv4();

    const aiAnswer = await this.openAiService.requestGrowiaryAI(
      createPostDTO.content,
      createPostDTO.template,
    );

    const { id, created, usage, content } = dataFromOpenAIResult(aiAnswer.message);

    // const date = await this.dateOffset({
    //   date: createPostDTO.date,
    //   offset: createPostDTO.offset,
    // });

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
        selectedAt: new Date(createPostDTO.date),
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
   * post에 피드백 추가
   * @param postFeedbackDto 추가할 피드백 정보
   * @returns 피드백 추가 결과
   */
  async postFeedback(postFeedbackDto: PostFeedbackDTO) {
    const { postId, feedback, feedbackDetail } = postFeedbackDto;
    const { userPostRef } = await this.getUserPostRef();

    try {
      const userPostsSnapshot = await userPostRef.get();
      if (userPostsSnapshot.exists) {
        const userPostsData = userPostsSnapshot.data();

        if (!userPostsData[postId]) {
          return { status: 404, message: 'Post not found for the user' };
        }

        userPostsData[postId].feedback = feedback;

        if (feedbackDetail) {
          userPostsData[postId].feedbackDetail = feedbackDetail;
        }

        await userPostRef.set(userPostsData, { merge: true });

        return {
          status: 200,
          message: 'Feedback added successfully',
          data: userPostsData[postId],
        };
      } else {
        return { status: 404, message: 'User has no posts' };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }

  /**
   * post 수정
   * @param postId 수정할 post의 id
   * @param content 수정할 내용
   * @param status post의 상태
   * @returns post 수정 결과
   */
  async postEdit(postEditDTO: PostEditDTO) {
    const { postId, content, status } = postEditDTO;

    const { userPostRef } = await this.getUserPostRef();

    try {
      const userPostsSnapshot = await userPostRef.get();
      if (userPostsSnapshot.exists) {
        const userPostsData = userPostsSnapshot.data();

        if (!userPostsData[postId]) {
          return { status: 404, message: 'Post not found for the user' };
        }

        if (content) {
          userPostsData[postId].content = content;
        }

        if (status) {
          userPostsData[postId].status = status;
        }

        userPostsData[postId].updateAt = new Date();

        await userPostRef.set(userPostsData, { merge: true });

        userPostsData[postId].createAt = dateConverter(userPostsData[postId].createAt);

        return {
          status: 200,
          message: 'Posts Updated Successfully',
          data: userPostsData[postId],
        };
      } else {
        return { status: 404, message: 'User has no posts' };
      }
    } catch (error) {
      return { status: 500, message: error.message };
    }
  }
}
