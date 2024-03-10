import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIService } from './openai/openai.service';
import { ResumeController } from './resume/resume.controller';

@Module({
  imports: [],
  controllers: [AppController, ResumeController],
  providers: [AppService, OpenAIService],
})
export class AppModule {}
