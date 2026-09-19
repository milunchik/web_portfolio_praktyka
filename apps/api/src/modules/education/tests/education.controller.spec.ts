import { Test, TestingModule } from '@nestjs/testing';
import { EducationController } from '../controllers/education.controller';
import {
  CreateEducationService,
  FindEducationByIdService,
  FindEducationsByUserService,
  UpdateEducationService,
  DeleteEducationService,
} from '../services';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { EducationEntity } from '../repositories/education.repository';
import { CreateEducationReqDto, UpdateEducationReqDto } from '../dtos/req';
import { EducationDegree } from '@prisma/client';

describe('EducationController', () => {
  let controller: EducationController;

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

  const mockCreateEducationService = {
    execute: jest.fn().mockResolvedValue(mockEducation),
  };
  const mockFindEducationByIdService = {
    execute: jest.fn().mockResolvedValue(mockEducation),
  };
  const mockFindEducationsByUserService = {
    execute: jest.fn().mockResolvedValue([mockEducation]),
  };
  const mockUpdateEducationService = {
    execute: jest.fn().mockResolvedValue(mockEducation),
  };
  const mockDeleteEducationService = {
    execute: jest.fn().mockResolvedValue(undefined),
  };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationController],
      providers: [
        { provide: CreateEducationService, useValue: mockCreateEducationService },
        { provide: FindEducationByIdService, useValue: mockFindEducationByIdService },
        { provide: FindEducationsByUserService, useValue: mockFindEducationsByUserService },
        { provide: UpdateEducationService, useValue: mockUpdateEducationService },
        { provide: DeleteEducationService, useValue: mockDeleteEducationService },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<EducationController>(EducationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get educations for current user on getMyEducations', async () => {
    const res = await controller.getMyEducations(1);
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe('Computer Science');
    expect(mockFindEducationsByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get educations by userId on getByUserId', async () => {
    const res = await controller.getByUserId(1);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);
    expect(mockFindEducationsByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get education by ID on getById', async () => {
    const res = await controller.getById(1);
    expect(res.id).toBe(1);
    expect(res.degree).toBe(EducationDegree.bachelor);
    expect(mockFindEducationByIdService.execute).toHaveBeenCalledWith(1);
  });

  it('should create education on create', async () => {
    const dto: CreateEducationReqDto = {
      title: 'Computer Science',
      degree: EducationDegree.bachelor,
      startDate: '2020-09-01T00:00:00.000Z',
    };
    const res = await controller.create(1, dto);
    expect(res.id).toBe(1);
    expect(mockCreateEducationService.execute).toHaveBeenCalledWith(1, dto);
  });

  it('should update education on update', async () => {
    const dto: UpdateEducationReqDto = {
      degree: EducationDegree.master,
    };
    const res = await controller.update(1, 1, dto);
    expect(res.id).toBe(1);
    expect(mockUpdateEducationService.execute).toHaveBeenCalledWith(1, 1, dto);
  });

  it('should delete education on delete', async () => {
    await controller.delete(1, 1);
    expect(mockDeleteEducationService.execute).toHaveBeenCalledWith(1, 1);
  });
});
