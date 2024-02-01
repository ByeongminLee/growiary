import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PostService } from './post.service';
import { CreatePostDTO, FilterFindPostDTO } from '@growiary/types';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findPost() {
    return this.postService.findPost();
  }

  @Get('filter')
  filterFindPost(@Body() filterFindPostDTO: FilterFindPostDTO) {
    return this.postService.filterFindPost(filterFindPostDTO);
  }

  @Post()
  createPost(@Body() createPostDTO: CreatePostDTO) {
    return this.postService.createPost(createPostDTO);
  }

  @Post('ai')
  createPostWithOpenAI(@Body() createPostDTO: CreatePostDTO) {
    return this.postService.createPostWithOpenAI(createPostDTO);
  }
}
