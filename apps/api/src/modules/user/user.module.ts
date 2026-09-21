import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import {
  CreateUserService,
  FindUserByIdService,
  FindUserByEmailService,
  FindUserByPublicUrlService,
  UpdateUserService,
  GenerateUserCvPdfService,
  UpdateEmailService,
  ChangePasswordService,
  DeleteUserService,
} from './services';

@Module({
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useClass: PrismaUserRepository },
    CreateUserService,
    FindUserByIdService,
    FindUserByEmailService,
    FindUserByPublicUrlService,
    UpdateUserService,
    GenerateUserCvPdfService,
    UpdateEmailService,
    ChangePasswordService,
    DeleteUserService,
  ],
  exports: [
    UserRepository,
    CreateUserService,
    FindUserByIdService,
    FindUserByEmailService,
    FindUserByPublicUrlService,
    UpdateUserService,
    GenerateUserCvPdfService,
    UpdateEmailService,
    ChangePasswordService,
    DeleteUserService,
  ],
})
export class UserModule {}
