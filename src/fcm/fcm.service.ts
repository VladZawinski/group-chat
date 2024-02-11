import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';

@Injectable()
export class FcmService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin
    ) {}
    async sendNotificationWithTopic(topic: string, title: any, body: string): Promise<void> {
        await this.firebase.messaging.send({
          topic: topic,
          notification: {
            title: title,
            body: body
          }
        });
  }
  async sendToToken(token: string, message: string) {
    return this.firebase.messaging.send({
      token: token,
      notification: {
        title: 'You got a message!',
        body: message
      }
    })
  }
}
