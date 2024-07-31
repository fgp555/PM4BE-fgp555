import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersDbService } from './usersDb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersDbService],
  controllers: [UserController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
