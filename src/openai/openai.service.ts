import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAIService {
  public openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_SECRET_KEY,
    });
  }

  async generateResumeAnalysis(
    resumeText: string,
    jobDescription: string = '',
  ): Promise<string> {
    const maxRetries = 5; // Maximum retry attempts
    let retryDelay = 1000; // Start with a 1 second delay

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a highly intelligent assistant, analyze resumes and provide constructive feedback.',
            },
            {
              role: 'user',
              content: `Resume: ${resumeText} Job Description: ${jobDescription}. Based on the resume and job description provided, give detailed analysis and suggestions for improvement.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 20,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        });
        const lastMessage = response.choices[0].message.content;
        return lastMessage.trim();
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // OpenAI rate limit error code
          console.log(`Rate limit hit, retrying after ${retryDelay}ms`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          retryDelay *= 2; // Exponential backoff
        } else {
          console.error('Failed to generate resume analysis:', error);
          throw new HttpException(
            'Failed to communicate with OpenAI service.',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
      }
    }

    throw new HttpException(
      'OpenAI service is currently unavailable. Please try again later.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
