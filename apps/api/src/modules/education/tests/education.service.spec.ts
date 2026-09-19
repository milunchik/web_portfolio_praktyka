import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EducationDegree } from '@prisma/client';
import {
  CreateEducationService,
  FindEducationByIdService,
  FindEducationsByUserService,
  UpdateEducationService,
  DeleteEducationService,
  EducationService,
} from '../services';
import { EducationRepository, EducationEntity } from '../repositories/education.repository';

describe('Education Services', () => {
  let createEducationService: CreateEducationService;
  let findEducationByIdService: FindEducationByIdService;
  let findEducationsByUserService: FindEducationsByUserService;
  let updateEducationService: UpdateEducationService;
  let deleteEducationService: DeleteEducationService;
  let educationService: EducationService;

  const mockEducation = new EducationEntity(
    1,
    1,
    'Computer Science',
    EducationDegree.bachelor,
    new Date('2020-09-01T00:00:00.000Z'),
    new Date('2024-06-30T00:00:00.000Z'),
    new Date('2020-09-01T00:00:00.000Z'),
    new Date('2020-09-01T00:00:00.000Z'),
  );

  const mockEducationRepository = {
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
        CreateEducationService,
        FindEducationByIdService,
        FindEducationsByUserService,
        UpdateEducationService,
        DeleteEducationService,
        EducationService,
        { provide: EducationRepository, useValue: mockEducationRepository },
      ],
    }).compile();

    createEducationService = module.get<CreateEducationService>(CreateEducationService);
    findEducationByIdService = module.get<FindEducationByIdService>(FindEducationByIdService);
    findEducationsByUserService = module.get<FindEducationsByUserService>(FindEducationsByUserService);
    updateEducationService = module.get<UpdateEducationService>(UpdateEducationService);
    deleteEducationService = module.get<DeleteEducationService>(DeleteEducationService);
    educationService = module.get<EducationService>(EducationService);
  });

  describe('CreateEducationService', () => {
    it('should create and return education entity', async () => {
      mockEducationRepository.create.mockResolvedValue(mockEducation);
      const dto = {
        title: 'Computer Science',
        degree: EducationDegree.bachelor,
        startDate: '2020-09-01T00:00:00.000Z',
      };
      const result = await createEducationService.execute(1, dto);
      expect(result).toEqual(mockEducation);
      expect(mockEducationRepository.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('FindEducationByIdService', () => {
    it('should return education if found', async () => {
      mockEducationRepository.findById.mockResolvedValue(mockEducation);
      const result = await findEducationByIdService.execute(1);
      expect(result).toEqual(mockEducation);
      expect(mockEducationRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockEducationRepository.findById.mockResolvedValue(null);
      await expect(findEducationByIdService.execute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindEducationsByUserService', () => {
    it('should return educations for user', async () => {
      mockEducationRepository.findByUserId.mockResolvedValue([mockEducation]);
      const result = await findEducationsByUserService.execute(1);
      expect(result).toEqual([mockEducation]);
      expect(mockEducationRepository.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('UpdateEducationService', () => {
    it('should update and return updated education', async () => {
      mockEducationRepository.findById.mockResolvedValue(mockEducation);
      mockEducationRepository.update.mockResolvedValue(mockEducation);
      const dto = { title: 'Software Engineering' };
      const result = await updateEducationService.execute(1, 1, dto);
      expect(result).toEqual(mockEducation);
      expect(mockEducationRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if education does not exist', async () => {
      mockEducationRepository.findById.mockResolvedValue(null);
      await expect(updateEducationService.execute(1, 999, { title: 'Software Engineering' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if education belongs to another user', async () => {
      mockEducationRepository.findById.mockResolvedValue(mockEducation);
      await expect(updateEducationService.execute(2, 1, { title: 'Software Engineering' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteEducationService', () => {
    it('should delete education successfully', async () => {
      mockEducationRepository.findById.mockResolvedValue(mockEducation);
      mockEducationRepository.delete.mockResolvedValue(undefined);
      await deleteEducationService.execute(1, 1);
      expect(mockEducationRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if education does not exist', async () => {
      mockEducationRepository.findById.mockResolvedValue(null);
      await expect(deleteEducationService.execute(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if education belongs to another user', async () => {
      mockEducationRepository.findById.mockResolvedValue(mockEducation);
      await expect(deleteEducationService.execute(2, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('EducationService facade', () => {
    it('should delegate create, findById, findByUserId, update, delete', async () => {
      mockEducationRepository.create.mockResolvedValue(mockEducation);
      mockEducationRepository.findById.mockResolvedValue(mockEducation);
      mockEducationRepository.findByUserId.mockResolvedValue([mockEducation]);
      mockEducationRepository.update.mockResolvedValue(mockEducation);
      mockEducationRepository.delete.mockResolvedValue(undefined);

      const dto = {
        title: 'Computer Science',
        degree: EducationDegree.bachelor,
        startDate: '2020-09-01T00:00:00.000Z',
      };

      expect(await educationService.create(1, dto)).toEqual(mockEducation);
      expect(await educationService.findById(1)).toEqual(mockEducation);
      expect(await educationService.findByUserId(1)).toEqual([mockEducation]);
      expect(await educationService.update(1, 1, { title: 'Software' })).toEqual(mockEducation);
      await expect(educationService.delete(1, 1)).resolves.toBeUndefined();
    });
  });
});
