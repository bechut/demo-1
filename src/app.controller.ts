import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  firebaseAdmin,
  firebaseAdminGetMessages,
  firebaseAdminGetSessions,
  firebaseBatchMessages,
  firebaseSendMessage,
} from './utils/firebase-admin';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Cron('*/10 * * * * *')
  async runEvery10Seconds() {
    const sessions = await firebaseAdminGetSessions();
    sessions.forEach(async (session) => {
      const lastMessage = await firebaseAdminGetMessages(`message-${session.uid}`);
      if (lastMessage && !lastMessage?.status) {
        const target = moment(new Date(lastMessage.createdAt._seconds * 1000));
        const nextHour = moment(target).add(1, 'minutes');
        if (moment().isAfter(nextHour)) {
          firebaseBatchMessages(`message-${session.uid}`, lastMessage.uid);
          console.log('ok');
        }
      }
    })

  }

  @Get()
  getHello() {
    firebaseSendMessage();
    return this.appService.getHello();
  }
}
