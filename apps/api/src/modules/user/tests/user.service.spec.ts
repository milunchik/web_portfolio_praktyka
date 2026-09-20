import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserRepository, UserEntity } from '../repositories/user.repository';
import { CreateUserService } from '../services/create-user.service';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import { FindUserByEmailService } from '../services/find-user-by-email.service';
import { FindUserByPublicUrlService } from '../services/find-user-by-public-url.service';
import { UpdateUserService } from '../services/update-user.service';
import { GenerateUserCvPdfService } from '../services/generate-user-cv-pdf.service';

describe('User Services', () => {
  let createUserService: CreateUserService;
  let findUserByIdService: FindUserByIdService;
  let findUserByEmailService: FindUserByEmailService;
  let findUserByPublicUrlService: FindUserByPublicUrlService;
  let updateUserService: UpdateUserService;
  let generateUserCvPdfService: GenerateUserCvPdfService;

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
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    createUserService = module.get<CreateUserService>(CreateUserService);
    findUserByIdService = module.get<FindUserByIdService>(FindUserByIdService);
    findUserByEmailService = module.get<FindUserByEmailService>(FindUserByEmailService);
    findUserByPublicUrlService = module.get<FindUserByPublicUrlService>(FindUserByPublicUrlService);
    updateUserService = module.get<UpdateUserService>(UpdateUserService);
    generateUserCvPdfService = module.get<GenerateUserCvPdfService>(GenerateUserCvPdfService);

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
