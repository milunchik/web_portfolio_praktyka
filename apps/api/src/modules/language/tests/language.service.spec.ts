import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { LanguageLevel } from '@prisma/client';
import {
  CreateLanguageService,
  FindLanguageByIdService,
  FindLanguagesByUserService,
  UpdateLanguageService,
  DeleteLanguageService,
  LanguageService,
} from '../services';
import { LanguageRepository, LanguageEntity } from '../repositories/language.repository';

describe('Language Services', () => {
  let createLanguageService: CreateLanguageService;
  let findLanguageByIdService: FindLanguageByIdService;
  let findLanguagesByUserService: FindLanguagesByUserService;
  let updateLanguageService: UpdateLanguageService;
  let deleteLanguageService: DeleteLanguageService;
  let languageService: LanguageService;

  const mockLanguage = new LanguageEntity(
    1,
    'English',
    LanguageLevel.advanced,
    new Date('2024-01-01T00:00:00.000Z'),
    new Date('2024-01-01T00:00:00.000Z'),
  );

  const mockLanguageRepository = {
    findById: jest.fn(),
    findByUserId: jest.fn(),
    isUserLanguage: jest.fn(),
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
        CreateLanguageService,
        FindLanguageByIdService,
        FindLanguagesByUserService,
        UpdateLanguageService,
        DeleteLanguageService,
        LanguageService,
        { provide: LanguageRepository, useValue: mockLanguageRepository },
      ],
    }).compile();

    createLanguageService = module.get<CreateLanguageService>(CreateLanguageService);
    findLanguageByIdService = module.get<FindLanguageByIdService>(FindLanguageByIdService);
    findLanguagesByUserService = module.get<FindLanguagesByUserService>(FindLanguagesByUserService);
    updateLanguageService = module.get<UpdateLanguageService>(UpdateLanguageService);
    deleteLanguageService = module.get<DeleteLanguageService>(DeleteLanguageService);
    languageService = module.get<LanguageService>(LanguageService);
  });

  describe('CreateLanguageService', () => {
    it('should create and return language entity', async () => {
      mockLanguageRepository.create.mockResolvedValue(mockLanguage);
      const dto = {
        name: 'English',
        level: LanguageLevel.advanced,
      };
      const result = await createLanguageService.execute(1, dto);
      expect(result).toEqual(mockLanguage);
      expect(mockLanguageRepository.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('FindLanguageByIdService', () => {
    it('should return language if found', async () => {
      mockLanguageRepository.findById.mockResolvedValue(mockLanguage);
      const result = await findLanguageByIdService.execute(1);
      expect(result).toEqual(mockLanguage);
      expect(mockLanguageRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockLanguageRepository.findById.mockResolvedValue(null);
      await expect(findLanguageByIdService.execute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindLanguagesByUserService', () => {
    it('should return languages for user', async () => {
      mockLanguageRepository.findByUserId.mockResolvedValue([mockLanguage]);
      const result = await findLanguagesByUserService.execute(1);
      expect(result).toEqual([mockLanguage]);
      expect(mockLanguageRepository.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('UpdateLanguageService', () => {
    it('should update and return updated language', async () => {
      mockLanguageRepository.findById.mockResolvedValue(mockLanguage);
      mockLanguageRepository.isUserLanguage.mockResolvedValue(true);
      mockLanguageRepository.update.mockResolvedValue(mockLanguage);
      const dto = { level: LanguageLevel.upper_intermediate };
      const result = await updateLanguageService.execute(1, 1, dto);
      expect(result).toEqual(mockLanguage);
      expect(mockLanguageRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if language does not exist', async () => {
      mockLanguageRepository.findById.mockResolvedValue(null);
      await expect(updateLanguageService.execute(1, 999, { name: 'English' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if language is not associated with user', async () => {
      mockLanguageRepository.findById.mockResolvedValue(mockLanguage);
      mockLanguageRepository.isUserLanguage.mockResolvedValue(false);
      await expect(updateLanguageService.execute(2, 1, { name: 'English' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteLanguageService', () => {
    it('should delete language successfully', async () => {
      mockLanguageRepository.findById.mockResolvedValue(mockLanguage);
      mockLanguageRepository.isUserLanguage.mockResolvedValue(true);
      mockLanguageRepository.delete.mockResolvedValue(undefined);
      await deleteLanguageService.execute(1, 1);
      expect(mockLanguageRepository.delete).toHaveBeenCalledWith(1, 1);
    });

    it('should throw NotFoundException if language does not exist', async () => {
      mockLanguageRepository.findById.mockResolvedValue(null);
      await expect(deleteLanguageService.execute(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if language is not associated with user', async () => {
      mockLanguageRepository.findById.mockResolvedValue(mockLanguage);
      mockLanguageRepository.isUserLanguage.mockResolvedValue(false);
      await expect(deleteLanguageService.execute(2, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('LanguageService facade', () => {
    it('should delegate create, findById, findByUserId, update, delete', async () => {
      mockLanguageRepository.create.mockResolvedValue(mockLanguage);
      mockLanguageRepository.findById.mockResolvedValue(mockLanguage);
      mockLanguageRepository.findByUserId.mockResolvedValue([mockLanguage]);
      mockLanguageRepository.isUserLanguage.mockResolvedValue(true);
      mockLanguageRepository.update.mockResolvedValue(mockLanguage);
      mockLanguageRepository.delete.mockResolvedValue(undefined);

      const dto = {
        name: 'English',
        level: LanguageLevel.advanced,
      };

      expect(await languageService.create(1, dto)).toEqual(mockLanguage);
      expect(await languageService.findById(1)).toEqual(mockLanguage);
      expect(await languageService.findByUserId(1)).toEqual([mockLanguage]);
      expect(await languageService.update(1, 1, { name: 'German' })).toEqual(mockLanguage);
      await expect(languageService.delete(1, 1)).resolves.toBeUndefined();
    });
  });
});
