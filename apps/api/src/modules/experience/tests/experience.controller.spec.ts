import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceController } from '../controllers/experience.controller';
import {
  CreateExperienceService,
  FindExperienceByIdService,
  FindExperiencesByUserService,
  UpdateExperienceService,
  DeleteExperienceService,
} from '../services';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { ExperienceEntity } from '../repositories/experience.repository';
import { CreateExperienceReqDto, UpdateExperienceReqDto } from '../dtos/req';

describe('ExperienceController', () => {
  let controller: ExperienceController;

  const mockExperience = new ExperienceEntity(
    1,
    1,
    'Google',
    'Senior Software Engineer',
    'Building high-throughput backend services.',
    new Date('2022-01-01T00:00:00.000Z'),
    null,
    ['TypeScript', 'NestJS'],
    new Date('2022-01-01T00:00:00.000Z'),
    new Date('2022-01-01T00:00:00.000Z'),
  );

  const mockCreateExperienceService = {
    execute: jest.fn().mockResolvedValue(mockExperience),
  };
  const mockFindExperienceByIdService = {
    execute: jest.fn().mockResolvedValue(mockExperience),
  };
  const mockFindExperiencesByUserService = {
    execute: jest.fn().mockResolvedValue([mockExperience]),
  };
  const mockUpdateExperienceService = {
    execute: jest.fn().mockResolvedValue(mockExperience),
  };
  const mockDeleteExperienceService = {
    execute: jest.fn().mockResolvedValue(undefined),
  };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceController],
      providers: [
        { provide: CreateExperienceService, useValue: mockCreateExperienceService },
        { provide: FindExperienceByIdService, useValue: mockFindExperienceByIdService },
        { provide: FindExperiencesByUserService, useValue: mockFindExperiencesByUserService },
        { provide: UpdateExperienceService, useValue: mockUpdateExperienceService },
        { provide: DeleteExperienceService, useValue: mockDeleteExperienceService },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<ExperienceController>(ExperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get experiences for current user on getMyExperiences', async () => {
    const res = await controller.getMyExperiences(1);
    expect(res).toHaveLength(1);
    expect(res[0].company).toBe('Google');
    expect(mockFindExperiencesByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get experiences by userId on getByUserId', async () => {
    const res = await controller.getByUserId(1);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);
    expect(mockFindExperiencesByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get experience by ID on getById', async () => {
    const res = await controller.getById(1);
    expect(res.id).toBe(1);
    expect(res.position).toBe('Senior Software Engineer');
    expect(mockFindExperienceByIdService.execute).toHaveBeenCalledWith(1);
  });

  it('should create experience on create', async () => {
    const dto: CreateExperienceReqDto = {
      company: 'Google',
      position: 'Senior Software Engineer',
      description: 'Building high-throughput backend services.',
      startDate: '2022-01-01T00:00:00.000Z',
    };
    const res = await controller.create(1, dto);
    expect(res.id).toBe(1);
    expect(mockCreateExperienceService.execute).toHaveBeenCalledWith(1, dto);
  });

  it('should update experience on update', async () => {
    const dto: UpdateExperienceReqDto = {
      position: 'Lead Engineer',
    };
    const res = await controller.update(1, 1, dto);
    expect(res.id).toBe(1);
    expect(mockUpdateExperienceService.execute).toHaveBeenCalledWith(1, 1, dto);
  });

  it('should delete experience on delete', async () => {
    await controller.delete(1, 1);
    expect(mockDeleteExperienceService.execute).toHaveBeenCalledWith(1, 1);
  });
});
