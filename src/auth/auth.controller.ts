import {
  Controller,
  Inject,
  Post,
  Req,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { Request } from 'express';

@Controller('auth')
export class AuthController {}
