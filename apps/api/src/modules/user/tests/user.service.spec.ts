import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import { FindUserByEmailService } from '../services/find-user-by-email.service';
import { FindUserByPublicUrlService } from '../services/find-user-by-public-url.service';
import { CreateUserService } from '../services/create-user.service';
import { UpdateUserService } from '../services/update-user.service';
import { UserRepository, UserEntity } from '../repositories/user.repository';

describe('User Services', () => {
  let findByIdService: FindUserByIdService;
  let findByEmailService: FindUserByEmailService;
  let findByPublicUrlService: FindUserByPublicUrlService;
  let createUserService: CreateUserService;
  let updateUserService: UpdateUserService;

  const mockUser = new UserEntity(
    1,
    'user@test.com',
    'User Test',
    'Description',
    'pass123',
    'user-test-url',
    'user',
    new Date(),
    new Date(),
  );

  const mockUserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByPublicUrl: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdService,
        FindUserByEmailService,
        FindUserByPublicUrlService,
        CreateUserService,
        UpdateUserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    findByIdService = module.get<FindUserByIdService>(FindUserByIdService);
    findByEmailService = module.get<FindUserByEmailService>(FindUserByEmailService);
    findByPublicUrlService = module.get<FindUserByPublicUrlService>(FindUserByPublicUrlService);
    createUserService = module.get<CreateUserService>(CreateUserService);
    updateUserService = module.get<UpdateUserService>(UpdateUserService);
  });

  describe('FindUserByIdService', () => {
    it('should return user if found', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      const result = await findByIdService.execute(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(findByIdService.execute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindUserByEmailService', () => {
    it('should return user by email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      const result = await findByEmailService.execute('user@test.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const result = await findByEmailService.execute('none@test.com');
      expect(result).toBeNull();
    });
  });

  describe('FindUserByPublicUrlService', () => {
    it('should return user by public url', async () => {
      mockUserRepository.findByPublicUrl.mockResolvedValue(mockUser);
      const result = await findByPublicUrlService.execute('user-test-url');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when public url does not exist', async () => {
      mockUserRepository.findByPublicUrl.mockResolvedValue(null);
      await expect(findByPublicUrlService.execute('unknown-url')).rejects.toThrow(NotFoundException);
    });
  });

  describe('CreateUserService', () => {
    it('should create and return user entity', async () => {
      mockUserRepository.create.mockResolvedValue(mockUser);
      const result = await createUserService.execute({
        email: 'user@test.com',
        fullName: 'User Test',
        password: 'hash',
        publicUrl: 'user-test-url',
      });
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });
  });

  describe('UpdateUserService', () => {
    it('should update and return updated user', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(mockUser);
      const result = await updateUserService.execute(1, { fullName: 'Updated Name' });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user to update does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(updateUserService.execute(99, { fullName: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });
});
