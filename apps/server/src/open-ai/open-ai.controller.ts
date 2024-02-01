import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { PromptType } from './types';
import { AdminGuard } from '../auth/admin.guard';

@UseGuards(AdminGuard)
@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Get()
  requestGrowiaryAI(@Body() data: { message: string }) {
    const { message } = data;
    return this.openAiService.requestGrowiaryAI(message);
  }

  @Get('/prompt')
  getRequestOpenAI(@Body() data: { prompt: PromptType[] }) {
    const { prompt } = data;
    return this.openAiService.requestOpenAI(prompt);
  }

  @Get('calculate-token-price')
  calculateTokenPrice(@Body() data: { inputToken: number; outputToken: number }) {
    const { inputToken, outputToken } = data;
    return this.openAiService.calculateTokenPrice(inputToken, outputToken);
  }
}
