import { Controller, Post, Body } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('analyze')
  async analyzeResume(
    @Body() body: { resumeText: string; jobDescription?: string },
  ) {
    return this.openAIService.generateResumeAnalysis(
      body.resumeText,
      body.jobDescription,
    );
  }
}
