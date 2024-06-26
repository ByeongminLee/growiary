import { Injectable } from '@nestjs/common';
import config from '../config';
import OpenAI from 'openai';
import { PromptType } from './types';
import { GROWIARY_PROMPT_CONTENT } from '../utils/constant';
import { PROMPT_TEMPLATE } from '@growiary/prompt';

@Injectable()
export class OpenAiService {
  private readonly openai;

  constructor() {
    this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
  }

  /**
   * openAI의 토큰 값을 계산 합니다
   * @param inputToken 입력 토큰 값
   * @param outputToken 출력 토큰 값
   * @returns 토큰 값에 대한 가격
   */
  calculateTokenPrice(inputToken: number, outputToken: number) {
    const inputTokenPricePerThousand = 0.001;
    const outputTokenPricePerThousand = 0.002;

    const inputTokenPrice = inputToken * (inputTokenPricePerThousand / 1000);
    const outputTokenPrice = outputToken * (outputTokenPricePerThousand / 1000);

    return {
      inputTokenPrice,
      outputTokenPrice,
      sumPrice: inputTokenPrice + outputTokenPrice,
    };
  }

  /**
   * openAI에 요청을 보냅니다
   * @param prompts openAI에 보낼 prompt
   * @returns openAI의 응답
   */
  async requestOpenAI(
    prompts: PromptType[],
  ): Promise<{ status: number; message: string }> {
    try {
      const response = await this.openai.chat.completions.create({
        messages: prompts,
        temperature: 0.75,
        model: 'gpt-3.5-turbo',
        max_tokens: 1200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return { status: 200, message: response };
    } catch (error) {
      return {
        status: error.statusCode,
        message: error.message,
      };
    }
  }

  /**
   * 유저 prompt를 생성합니다
   * @param message 유저 메세지
   * @returns 유저 prompt
   */
  createUserPrompt = (message: string): PromptType => {
    return { role: 'user', content: message };
  };

  /**
   * growiary prompt를 생성합니다
   * @param prompt 같이 전송할 prompt
   * @param template prompt 템플릿 번호
   * @returns growiary system prompt와 같이 전송할 prompt을 반환
   */
  getGrowiaryPrompt(prompt?: PromptType, template?: string): PromptType[] {
    const SYSTEM_PROMPT = template
      ? PROMPT_TEMPLATE[template].prompt
      : GROWIARY_PROMPT_CONTENT;

    const growiaryPrompt: PromptType[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
    ];

    if (prompt) {
      growiaryPrompt.push(prompt);
    }

    return growiaryPrompt;
  }

  /**
   * openAI에 growiary prompt를 보냅니다
   * @param message 유저 메세지
   * @returns openAI의 응답
   */
  async requestGrowiaryAI(
    message: string,
    template?: string,
  ): Promise<{ status: number; message: string }> {
    const userPromptMsg = this.createUserPrompt(message);
    const prompts = this.getGrowiaryPrompt(userPromptMsg, template);

    return this.requestOpenAI(prompts);
  }
}
