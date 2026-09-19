import { Test, TestingModule } from '@nestjs/testing';
import { LanguageController } from '../controllers/language.controller';
import {
  CreateLanguageService,
  FindLanguageByIdService,
  FindLanguagesByUserService,
  UpdateLanguageService,
  DeleteLanguageService,
} from '../services';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { LanguageEntity } from '../repositories/language.repository';
import { CreateLanguageReqDto, UpdateLanguageReqDto } from '../dtos/req';
import { LanguageLevel } from '@prisma/client';

describe('LanguageController', () => {
  let controller: LanguageController;

  const mockLanguage = new LanguageEntity(
    1,
    'English',
    LanguageLevel.advanced,
    new Date('2024-01-01T00:00:00.000Z'),
    new Date('2024-01-01T00:00:00.000Z'),
  );

  const mockCreateLanguageService = {
    execute: jest.fn().mockResolvedValue(mockLanguage),
  };
  const mockFindLanguageByIdService = {
    execute: jest.fn().mockResolvedValue(mockLanguage),
  };
  const mockFindLanguagesByUserService = {
    execute: jest.fn().mockResolvedValue([mockLanguage]),
  };
  const mockUpdateLanguageService = {
    execute: jest.fn().mockResolvedValue(mockLanguage),
  };
  const mockDeleteLanguageService = {
    execute: jest.fn().mockResolvedValue(undefined),
  };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageController],
      providers: [
        { provide: CreateLanguageService, useValue: mockCreateLanguageService },
        { provide: FindLanguageByIdService, useValue: mockFindLanguageByIdService },
        { provide: FindLanguagesByUserService, useValue: mockFindLanguagesByUserService },
        { provide: UpdateLanguageService, useValue: mockUpdateLanguageService },
        { provide: DeleteLanguageService, useValue: mockDeleteLanguageService },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<LanguageController>(LanguageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get languages for current user on getMyLanguages', async () => {
    const res = await controller.getMyLanguages(1);
    expect(res).toHaveLength(1);
    expect(res[0].name).toBe('English');
    expect(mockFindLanguagesByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get languages by userId on getByUserId', async () => {
    const res = await controller.getByUserId(1);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);
    expect(mockFindLanguagesByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get language by ID on getById', async () => {
    const res = await controller.getById(1);
    expect(res.id).toBe(1);
    expect(res.name).toBe('English');
    expect(mockFindLanguageByIdService.execute).toHaveBeenCalledWith(1);
  });

  it('should create language on create', async () => {
    const dto: CreateLanguageReqDto = {
      name: 'English',
      level: LanguageLevel.advanced,
    };
    const res = await controller.create(1, dto);
    expect(res.id).toBe(1);
    expect(mockCreateLanguageService.execute).toHaveBeenCalledWith(1, dto);
  });

  it('should update language on update', async () => {
    const dto: UpdateLanguageReqDto = {
      level: LanguageLevel.upper_intermediate,
    };
    const res = await controller.update(1, 1, dto);
    expect(res.id).toBe(1);
    expect(mockUpdateLanguageService.execute).toHaveBeenCalledWith(1, 1, dto);
  });

  it('should delete language on delete', async () => {
    await controller.delete(1, 1);
    expect(mockDeleteLanguageService.execute).toHaveBeenCalledWith(1, 1);
  });
});
