import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PostService } from './post.service';
import {
  CreatePostDTO,
  FilterFindPostDTO,
  PostEditDTO,
  PostFeedbackDTO,
} from '@growiary/types';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findPost() {
    return this.postService.findPost();
  }

  @Post()
  createPost(@Body() createPostDTO: CreatePostDTO) {
    return this.postService.createPost(createPostDTO);
  }

  @Post('filter')
  filterFindPost(@Body() filterFindPostDTO: FilterFindPostDTO) {
    return this.postService.filterFindPost(filterFindPostDTO);
  }

  @Post('ai')
  createPostWithOpenAI(@Body() createPostDTO: CreatePostDTO) {
    return this.postService.createPostWithOpenAI(createPostDTO);
  }

  @Post('feedback')
  postFeedback(@Body() postFeedbackDto: PostFeedbackDTO) {
    return this.postService.postFeedback(postFeedbackDto);
  }

  @Post('edit')
  postEdit(@Body() postEditDTO: PostEditDTO) {
    return this.postService.postEdit(postEditDTO);
  }
}
