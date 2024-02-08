import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  providers: [FcmService],
  exports: [FcmService],
  imports: [
    FirebaseModule.forRoot({
        googleApplicationCredential: 'src/config/firebaseadmin.json'
    })
  ]
})
export class FcmModule {}
