import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import { FindUserByPublicUrlService } from '../services/find-user-by-public-url.service';
import { UpdateUserService } from '../services/update-user.service';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { UserEntity } from '../repositories/user.repository';

describe('UserController', () => {
  let controller: UserController;

  const mockUser = new UserEntity(
    1,
    'test@example.com',
    'Test User',
    'Test description',
    'hashedPassword',
    'test-user-123',
    'user',
    new Date(),
    new Date(),
  );

  const mockFindUserById = {
    execute: jest.fn().mockResolvedValue(mockUser),
  };
  const mockFindUserByPublicUrl = {
    execute: jest.fn().mockResolvedValue(mockUser),
  };
  const mockUpdateUserService = {
    execute: jest.fn().mockResolvedValue(mockUser),
  };
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
        { provide: FindUserByPublicUrlService, useValue: mockFindUserByPublicUrl },
        { provide: UpdateUserService, useValue: mockUpdateUserService },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return safe user on getMe', async () => {
    const res = await controller.getMe(1);
    expect(res.id).toBe(1);
    expect(res.email).toBe('test@example.com');
    expect((res as any).password).toBeUndefined();
  });

  it('should return safe user on findById', async () => {
    const res = await controller.findById(1);
    expect(res.id).toBe(1);
    expect(res.fullName).toBe('Test User');
  });

  it('should return safe user on getByPublicUrl', async () => {
    const res = await controller.getByPublicUrl('test-user-123');
    expect(res.publicUrl).toBe('test-user-123');
  });

  it('should update user and return safe user on updateMe', async () => {
    const res = await controller.updateMe(1, { description: 'Updated' });
    expect(res.id).toBe(1);
  });
});
