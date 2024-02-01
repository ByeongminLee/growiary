import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { OpenAiService } from '../open-ai/open-ai.service';

@Module({
  controllers: [PostController],
  providers: [PostService, OpenAiService],
})
export class PostModule {}
