import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import { TokenPort } from '../../../shared/domain/ports/token.port';

describe('UserController', () => {
  let controller: UserController;

  const mockFindUserById = { execute: jest.fn() };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: FindUserByIdService, useValue: mockFindUserById },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
