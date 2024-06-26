import { Module } from '@nestjs/common';
import { OpenAiController } from './open-ai.controller';
import { OpenAiService } from './open-ai.service';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
})
export class OpenAiModule {}
