import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  firebaseAdmin,
  firebaseAdminGetMessages,
  firebaseBatchMessages,
  firebaseSendMessage,
} from './utils/firebase-admin';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Cron('*/10 * * * * *')
  async runEvery10Seconds() {
    const lastMessage = await firebaseAdminGetMessages('message-1');
    if (lastMessage) {
      const target = moment(new Date(lastMessage.createdAt._seconds * 1000));
      const nextHour = moment(target).add(1, 'hour');
      if (moment().isAfter(nextHour)) {
        firebaseBatchMessages('message-1', lastMessage.uid);
        console.log('ok');
      }
    }
  }

  @Get()
  getHello() {
    firebaseSendMessage();
    return this.appService.getHello();
  }
}
