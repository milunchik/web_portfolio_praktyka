import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { UserRepository, UserEntity } from '../repositories/user.repository';
import { CreateUserService } from '../services/create-user.service';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import { FindUserByEmailService } from '../services/find-user-by-email.service';
import { FindUserByPublicUrlService } from '../services/find-user-by-public-url.service';
import { UpdateUserService } from '../services/update-user.service';
import { GenerateUserCvPdfService } from '../services/generate-user-cv-pdf.service';
import { UpdateEmailService } from '../services/update-email.service';
import { ChangePasswordService } from '../services/change-password.service';
import { DeleteUserService } from '../services/delete-user.service';
import { PasswordPort } from '../../../shared/domain/ports/password.port';

describe('User Services', () => {
  let createUserService: CreateUserService;
  let findUserByIdService: FindUserByIdService;
  let findUserByEmailService: FindUserByEmailService;
  let findUserByPublicUrlService: FindUserByPublicUrlService;
  let updateUserService: UpdateUserService;
  let generateUserCvPdfService: GenerateUserCvPdfService;
  let updateEmailService: UpdateEmailService;
  let changePasswordService: ChangePasswordService;
  let deleteUserService: DeleteUserService;

  const mockUser = new UserEntity(
    1,
    'user@test.com',
    'User Test',
    'A passionate fullstack engineer with React & Node experience.',
    'hashedPassword123',
    'user-test-url',
    'user',
    new Date(),
    new Date(),
    [
      {
        id: 1,
        userId: 1,
        title: 'Master of Science in Software Engineering',
        degree: 'master',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2022-06-30'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    [
      {
        id: 1,
        userId: 1,
        company: 'Tech Solutions LLC',
        position: 'Senior Full Stack Developer',
        description: 'Led architecture and development of core services.',
        startDate: new Date('2022-07-01'),
        endDate: null,
        skills: ['TypeScript', 'NestJS', 'React', 'PostgreSQL'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    [
      {
        id: 1,
        userId: 1,
        title: 'E-commerce Platform',
        description: 'Built scalable microservices.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    [],
    [
      {
        id: 1,
        name: 'English',
        level: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    null,
    null,
  );

  const mockUserRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByPublicUrl: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPasswordPort = {
    hash: jest.fn().mockResolvedValue('newHashedPassword'),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        FindUserByIdService,
        FindUserByEmailService,
        FindUserByPublicUrlService,
        UpdateUserService,
        GenerateUserCvPdfService,
        UpdateEmailService,
        ChangePasswordService,
        DeleteUserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: PasswordPort, useValue: mockPasswordPort },
      ],
    }).compile();

    createUserService = module.get<CreateUserService>(CreateUserService);
    findUserByIdService = module.get<FindUserByIdService>(FindUserByIdService);
    findUserByEmailService = module.get<FindUserByEmailService>(FindUserByEmailService);
    findUserByPublicUrlService = module.get<FindUserByPublicUrlService>(FindUserByPublicUrlService);
    updateUserService = module.get<UpdateUserService>(UpdateUserService);
    generateUserCvPdfService = module.get<GenerateUserCvPdfService>(GenerateUserCvPdfService);
    updateEmailService = module.get<UpdateEmailService>(UpdateEmailService);
    changePasswordService = module.get<ChangePasswordService>(ChangePasswordService);
    deleteUserService = module.get<DeleteUserService>(DeleteUserService);

    jest.clearAllMocks();
  });

  describe('CreateUserService', () => {
    it('should create and return a new user', async () => {
      mockUserRepository.create.mockResolvedValue(mockUser);
      const result = await createUserService.execute({
        email: 'user@test.com',
        fullName: 'User Test',
        password: 'hashedPassword123',
        publicUrl: 'user-test-url',
      });
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });
  });

  describe('FindUserByIdService', () => {
    it('should find user by id', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      const result = await findUserByIdService.execute(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(findUserByIdService.execute(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindUserByEmailService', () => {
    it('should find user by email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      const result = await findUserByEmailService.execute('user@test.com');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('user@test.com');
    });

    it('should return null if user with email does not exist', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      const result = await findUserByEmailService.execute('none@test.com');
      expect(result).toBeNull();
    });
  });

  describe('FindUserByPublicUrlService', () => {
    it('should find user by public url', async () => {
      mockUserRepository.findByPublicUrl.mockResolvedValue(mockUser);
      const result = await findUserByPublicUrlService.execute('user-test-url');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByPublicUrl).toHaveBeenCalledWith('user-test-url');
    });

    it('should throw NotFoundException if user with public url does not exist', async () => {
      mockUserRepository.findByPublicUrl.mockResolvedValue(null);
      await expect(findUserByPublicUrlService.execute('none-url')).rejects.toThrow(NotFoundException);
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

    it('should throw ConflictException if new email is taken by another user', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue({ ...mockUser, id: 2 });
      await expect(updateUserService.execute(1, { email: 'taken@test.com' })).rejects.toThrow(ConflictException);
    });
  });

  describe('UpdateEmailService', () => {
    it('should return user without update if email is unchanged', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      const result = await updateEmailService.execute(1, { email: 'user@test.com' });
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('should update email when new email is available', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.update.mockResolvedValue({ ...mockUser, email: 'new@test.com' });

      const result = await updateEmailService.execute(1, { email: 'new@test.com' });
      expect(result.email).toBe('new@test.com');
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, { email: 'new@test.com' });
    });

    it('should throw ConflictException if email is already taken by another user', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue({ ...mockUser, id: 2, email: 'taken@test.com' });

      await expect(updateEmailService.execute(1, { email: 'taken@test.com' })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(updateEmailService.execute(99, { email: 'test@test.com' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('ChangePasswordService', () => {
    it('should change password successfully', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPasswordPort.compare.mockResolvedValue(true);
      mockPasswordPort.hash.mockResolvedValue('newHashedPassword');
      mockUserRepository.update.mockResolvedValue(mockUser);

      const result = await changePasswordService.execute(1, {
        currentPassword: 'correctPassword',
        newPassword: 'NewPassword123!',
      });

      expect(result.message).toBe('Password changed successfully');
      expect(mockPasswordPort.compare).toHaveBeenCalledWith('correctPassword', mockUser.password);
      expect(mockPasswordPort.hash).toHaveBeenCalledWith('NewPassword123!');
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, { password: 'newHashedPassword' });
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockPasswordPort.compare.mockResolvedValue(false);

      await expect(
        changePasswordService.execute(1, {
          currentPassword: 'wrongPassword',
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        changePasswordService.execute(99, {
          currentPassword: 'anyPassword',
          newPassword: 'NewPassword123!',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DeleteUserService', () => {
    it('should delete user and return success message', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      const result = await deleteUserService.execute(1);
      expect(result.message).toBe('Account deleted successfully');
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(deleteUserService.execute(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GenerateUserCvPdfService', () => {
    it('should generate PDF buffer for user by ID', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      const { buffer, fileName } = await generateUserCvPdfService.executeById(1);
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
      expect(fileName).toBe('User_Test_CV.pdf');
    });

    it('should generate PDF buffer respecting custom display options', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      const { buffer, fileName } = await generateUserCvPdfService.executeById(1, {
        showPhoto: false,
        showContact: false,
        showAbout: false,
        showExperience: false,
        showEducation: false,
        showSkills: false,
        showLanguages: false,
        showProjects: false,
      });
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(0);
      expect(fileName).toBe('User_Test_CV.pdf');
    });

    it('should generate PDF buffer for user by public URL', async () => {
      mockUserRepository.findByPublicUrl.mockResolvedValue(mockUser);
      const { buffer, fileName } = await generateUserCvPdfService.executeByPublicUrl('user-test-url');
      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(fileName).toBe('User_Test_CV.pdf');
    });

    it('should throw NotFoundException if user not found by ID', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(generateUserCvPdfService.executeById(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user not found by public URL', async () => {
      mockUserRepository.findByPublicUrl.mockResolvedValue(null);
      await expect(generateUserCvPdfService.executeByPublicUrl('unknown')).rejects.toThrow(NotFoundException);
    });
  });
});
