import {
  Controller,
  Get,
  Param,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  firebaseAdminGetUserByEmail,
  firebaseAdminGetUsers,
  firebaseAdminGetUsersByListId,
} from 'src/utils/firebase-admin';

@Controller('user')
export class UserController {
  @Get()
  users() {
    return firebaseAdminGetUsers();
  }

  @Get('uids')
  async getByListUid(@Query('uids') uids: string[]) {
    console.log(uids);
    if (!uids?.length) return [];
    return await firebaseAdminGetUsersByListId(uids);
  }

  @Get(':email')
  async getByEmail(
    @Param('email') email: string,
    @Req() req: Request & { user: any },
  ) {
    const user: any = await firebaseAdminGetUserByEmail(email);
    if (user.email === req.user.email) {
      throw new NotFoundException('No user found');
    }
    return await firebaseAdminGetUserByEmail(email);
  }
}
