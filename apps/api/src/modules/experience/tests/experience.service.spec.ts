import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  CreateExperienceService,
  FindExperienceByIdService,
  FindExperiencesByUserService,
  UpdateExperienceService,
  DeleteExperienceService,
  ExperienceService,
} from '../services';
import { ExperienceRepository, ExperienceEntity } from '../repositories/experience.repository';

describe('Experience Services', () => {
  let createExperienceService: CreateExperienceService;
  let findExperienceByIdService: FindExperienceByIdService;
  let findExperiencesByUserService: FindExperiencesByUserService;
  let updateExperienceService: UpdateExperienceService;
  let deleteExperienceService: DeleteExperienceService;
  let experienceService: ExperienceService;

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

  const mockExperienceRepository = {
    findById: jest.fn(),
    findByUserId: jest.fn(),
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
        CreateExperienceService,
        FindExperienceByIdService,
        FindExperiencesByUserService,
        UpdateExperienceService,
        DeleteExperienceService,
        ExperienceService,
        { provide: ExperienceRepository, useValue: mockExperienceRepository },
      ],
    }).compile();

    createExperienceService = module.get<CreateExperienceService>(CreateExperienceService);
    findExperienceByIdService = module.get<FindExperienceByIdService>(FindExperienceByIdService);
    findExperiencesByUserService = module.get<FindExperiencesByUserService>(FindExperiencesByUserService);
    updateExperienceService = module.get<UpdateExperienceService>(UpdateExperienceService);
    deleteExperienceService = module.get<DeleteExperienceService>(DeleteExperienceService);
    experienceService = module.get<ExperienceService>(ExperienceService);
  });

  describe('CreateExperienceService', () => {
    it('should create and return experience entity', async () => {
      mockExperienceRepository.create.mockResolvedValue(mockExperience);
      const dto = {
        company: 'Google',
        position: 'Senior Software Engineer',
        description: 'Building high-throughput backend services.',
        startDate: '2022-01-01T00:00:00.000Z',
      };
      const result = await createExperienceService.execute(1, dto);
      expect(result).toEqual(mockExperience);
      expect(mockExperienceRepository.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('FindExperienceByIdService', () => {
    it('should return experience if found', async () => {
      mockExperienceRepository.findById.mockResolvedValue(mockExperience);
      const result = await findExperienceByIdService.execute(1);
      expect(result).toEqual(mockExperience);
      expect(mockExperienceRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockExperienceRepository.findById.mockResolvedValue(null);
      await expect(findExperienceByIdService.execute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindExperiencesByUserService', () => {
    it('should return experiences for user', async () => {
      mockExperienceRepository.findByUserId.mockResolvedValue([mockExperience]);
      const result = await findExperiencesByUserService.execute(1);
      expect(result).toEqual([mockExperience]);
      expect(mockExperienceRepository.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('UpdateExperienceService', () => {
    it('should update and return updated experience', async () => {
      mockExperienceRepository.findById.mockResolvedValue(mockExperience);
      mockExperienceRepository.update.mockResolvedValue(mockExperience);
      const dto = { position: 'Staff Software Engineer' };
      const result = await updateExperienceService.execute(1, 1, dto);
      expect(result).toEqual(mockExperience);
      expect(mockExperienceRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if experience does not exist', async () => {
      mockExperienceRepository.findById.mockResolvedValue(null);
      await expect(updateExperienceService.execute(1, 999, { position: 'Staff' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if experience belongs to another user', async () => {
      mockExperienceRepository.findById.mockResolvedValue(mockExperience);
      await expect(updateExperienceService.execute(2, 1, { position: 'Staff' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteExperienceService', () => {
    it('should delete experience successfully', async () => {
      mockExperienceRepository.findById.mockResolvedValue(mockExperience);
      mockExperienceRepository.delete.mockResolvedValue(undefined);
      await deleteExperienceService.execute(1, 1);
      expect(mockExperienceRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if experience does not exist', async () => {
      mockExperienceRepository.findById.mockResolvedValue(null);
      await expect(deleteExperienceService.execute(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if experience belongs to another user', async () => {
      mockExperienceRepository.findById.mockResolvedValue(mockExperience);
      await expect(deleteExperienceService.execute(2, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ExperienceService facade', () => {
    it('should delegate create, findById, findByUserId, update, delete', async () => {
      mockExperienceRepository.create.mockResolvedValue(mockExperience);
      mockExperienceRepository.findById.mockResolvedValue(mockExperience);
      mockExperienceRepository.findByUserId.mockResolvedValue([mockExperience]);
      mockExperienceRepository.update.mockResolvedValue(mockExperience);
      mockExperienceRepository.delete.mockResolvedValue(undefined);

      const dto = {
        company: 'Google',
        position: 'Senior Software Engineer',
        description: 'Building high-throughput backend services.',
        startDate: '2022-01-01T00:00:00.000Z',
      };

      expect(await experienceService.create(1, dto)).toEqual(mockExperience);
      expect(await experienceService.findById(1)).toEqual(mockExperience);
      expect(await experienceService.findByUserId(1)).toEqual([mockExperience]);
      expect(await experienceService.update(1, 1, { position: 'Staff' })).toEqual(mockExperience);
      await expect(experienceService.delete(1, 1)).resolves.toBeUndefined();
    });
  });
});
