import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { FeedbackModule } from './feedback/feedback.module';
import * as admin from 'firebase-admin';
import config from './config';

@Module({
  imports: [UserModule, PostModule, OpenAiModule, FeedbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.FIREBASE_PROJECT_ID,
        clientEmail: config.FIREBASE_CLIENT_EMAIL,
        privateKey: config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
}
