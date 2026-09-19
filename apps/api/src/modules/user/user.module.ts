import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { FindUserByIdService } from './services/find-user-by-id.service';
import { FindUserByEmailService } from './services/find-user-by-email.service';
import { FindUserByPublicUrlService } from './services/find-user-by-public-url.service';
import { CreateUserService } from './services/create-user.service';
import { UpdateUserService } from './services/update-user.service';
import { UserController } from './controllers/user.controller';

@Module({
  providers: [
    { provide: UserRepository, useClass: PrismaUserRepository },
    FindUserByIdService,
    FindUserByEmailService,
    FindUserByPublicUrlService,
    CreateUserService,
    UpdateUserService,
  ],
  controllers: [UserController],
  exports: [
    UserRepository,
    FindUserByIdService,
    FindUserByEmailService,
    FindUserByPublicUrlService,
    CreateUserService,
    UpdateUserService,
  ],
})
export class UserModule {}
