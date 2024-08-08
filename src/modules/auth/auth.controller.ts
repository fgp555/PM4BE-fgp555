// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpException,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { TransformEmailInterceptor } from 'src/interceptors/email.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ========================================
  @Post('signup')
  @UseInterceptors(TransformEmailInterceptor)
  async signUp(
    @Body() body: SignUpDto,
    @Res() res: Response,
    //
  ) {
    try {
      const result = await this.authService.signUp(body);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      // throw new BadRequestException(error.message);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ========================================
  @Post('signin')
  @UseInterceptors(TransformEmailInterceptor)
  async signIn(@Body() login: SignInDto) {
    const { email, password } = login;
    console.log(email)
    return await this.authService.signIn(email, password);
  }
}
