// src/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { UsersDbService } from '../users/usersDb.service';
import { JwtService } from '@nestjs/jwt';
import { RolesEnum } from '../users/enum/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersDbService: UsersDbService,
    private readonly jwtService: JwtService,
  ) {}

  // ========================================
  async signUp(bodyObject: SignUpDto) {
    const foundUser = await this.usersDbService.findUserByEmail(
      bodyObject.email,
    );
    if (foundUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(bodyObject.password, 10);
    if (!hashedPassword) {
      throw new BadRequestException('Password could not be hashed');
    }

    const user = await this.usersDbService.saveUser({
      ...bodyObject,
      password: hashedPassword,
    });
    const { password, ...userRest } = user;
    return { success: 'User created successfully', result: userRest };
  }

  // ========================================
  async signIn(email: string, password: string) {
    const foundUser = await this.usersDbService.findUserByEmail(email);
    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Wrong password');
    }

    const userPayload = {
      sub: foundUser.id,
      id: foundUser.id,
      email: foundUser.email,
      roles: [foundUser.roles ? RolesEnum.Admin : RolesEnum.User],
    };
    const token = this.jwtService.sign(userPayload);
    const { password: _, ...user } = foundUser;
    return { success: 'User logged in successfully', user, token };
  }
}
