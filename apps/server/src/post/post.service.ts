import { CreatePostDTO, FilterFindPostDTO } from '@growiary/types';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { firestore } from 'firebase-admin';
import { dateConverter } from '../utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostService {
  constructor(@Inject(REQUEST) private readonly request: { user: any }) {}

  async findPost() {
    const { userId } = this.request.user;
    const userPostRef = firestore().collection('posts').doc(userId);

    try {
      const userPostsSnapshot = await userPostRef.get();

      if (userPostsSnapshot.exists) {
        const userPostsData = userPostsSnapshot.data();

        const postsArray = Object.keys(userPostsData).map(date => ({
          date,
          ...userPostsData[date],
          createAt: dateConverter(userPostsData[date].createAt),
          updateAt: dateConverter(userPostsData[date].updateAt),
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

  async filterFindPost(filterFindPostDTO: FilterFindPostDTO) {
    const { startDate, endDate } = filterFindPostDTO;
    const { userId } = this.request.user;
    const userPostRef = firestore().collection('posts').doc(userId);

    const userPostsDoc = await userPostRef.get();
    const userPostsData = userPostsDoc.data();

    const filteredPosts = {};

    Object.keys(userPostsData).forEach(timestamp => {
      const post = userPostsData[timestamp];

      const createAtDate = dateConverter(post.createAt);
      const updateAtDate = dateConverter(post.updateAt);

      if (createAtDate >= new Date(startDate) && createAtDate < new Date(endDate)) {
        filteredPosts[timestamp] = {
          ...post,
          createAt: createAtDate,
          updateAt: updateAtDate,
        };
      }
    });

    return filteredPosts;
  }

  async createPost(createPostDTO: CreatePostDTO) {
    const { userId } = this.request.user;

    const userPostRef = firestore().collection('posts').doc(userId);

    const postKey = uuidv4();

    const data = {
      [postKey]: {
        title: createPostDTO.title,
        content: createPostDTO.content,
        template: createPostDTO.template,
        createAt: new Date(),
        updateAt: new Date(),
      },
    };

    await userPostRef.set(data, { merge: true });

    return { status: 200, data };
  }
}
