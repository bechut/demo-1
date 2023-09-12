import { Controller, Get, Param, Req } from '@nestjs/common';
import {
  firebaseAdminGetUserSessions,
  firebaseAdminGetUserSessionById,
} from 'src/utils/firebase-admin';

@Controller('sessions')
export class SessionsController {
  @Get('')
  async getSessions(@Req() req: Request & { user: any }) {
    return await firebaseAdminGetUserSessions(req.user.uid);
  }

  @Get(':id')
  async getSession(@Param('id') id: number) {
    return await firebaseAdminGetUserSessionById(id);
  }
}
