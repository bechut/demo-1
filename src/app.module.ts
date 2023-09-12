import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { firebaseAdmin } from './utils/firebase-admin';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { SessionsModule } from './sessions/sessions.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    ConfigModule.forRoot(),
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return firebaseAdmin(configService.get<string>('FIREBASE_PROJECT_ID'));
      },
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
