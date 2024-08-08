// src/modules/users/users.controller.ts

import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpStatus,
  Res,
  UseGuards,
  NotFoundException,
  BadRequestException,
  HttpException,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UsersDbService } from './usersDb.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from './decorator/roles.decorator';
import { RolesEnum } from './enum/roles.enum';
import { RolesGuard } from './roles.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransformEmailInterceptor } from 'src/interceptors/email.interceptor';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly usersDbService: UsersDbService) {}

  // ========================================
  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of elements per page',
    schema: { default: 5 },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    schema: { default: 1 },
  })

  // ========================================
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Res() res: Response,
  ) {
    try {
      const users = await this.usersDbService.getAllUsers(page, limit);
      // return users;

      res.status(HttpStatus.OK).json(users);
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
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolesEnum.Admin)
  async getUser(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    try {
      const user = await this.usersDbService.getUserById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const updatedId = await this.usersDbService.updateUser(id, user);
      if (updatedId === null) {
        throw new NotFoundException('User not found');
      }
      res.status(HttpStatus.OK).json({ id: updatedId });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    try {
      const deletedId = await this.usersDbService.deleteUser(id);
      if (deletedId === null) {
        throw new NotFoundException('User not found');
      }
      res.status(HttpStatus.OK).json({ id });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
