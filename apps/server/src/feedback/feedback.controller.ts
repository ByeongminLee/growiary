import { UserFeedbackDTO } from '@growiary/types';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  findFeedback() {
    return this.feedbackService.findUserFeedback();
  }

  @Post()
  userFeedback(@Body() userFeedbackDTO: UserFeedbackDTO) {
    return this.feedbackService.createUserFeedback(userFeedbackDTO);
  }
}
