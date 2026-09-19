import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from '../controllers/project.controller';
import {
  CreateProjectService,
  FindProjectByIdService,
  FindProjectsByUserService,
  UpdateProjectService,
  DeleteProjectService,
} from '../services';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { ProjectEntity } from '../repositories/project.repository';
import { CreateProjectReqDto, UpdateProjectReqDto } from '../dtos/req';

describe('ProjectController', () => {
  let controller: ProjectController;

  const mockProject = new ProjectEntity(
    1,
    1,
    'Portfolio Website',
    'A modern portfolio web application.',
    new Date('2024-01-01T00:00:00.000Z'),
    new Date('2024-01-01T00:00:00.000Z'),
  );

  const mockCreateProjectService = {
    execute: jest.fn().mockResolvedValue(mockProject),
  };
  const mockFindProjectByIdService = {
    execute: jest.fn().mockResolvedValue(mockProject),
  };
  const mockFindProjectsByUserService = {
    execute: jest.fn().mockResolvedValue([mockProject]),
  };
  const mockUpdateProjectService = {
    execute: jest.fn().mockResolvedValue(mockProject),
  };
  const mockDeleteProjectService = {
    execute: jest.fn().mockResolvedValue(undefined),
  };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        { provide: CreateProjectService, useValue: mockCreateProjectService },
        { provide: FindProjectByIdService, useValue: mockFindProjectByIdService },
        { provide: FindProjectsByUserService, useValue: mockFindProjectsByUserService },
        { provide: UpdateProjectService, useValue: mockUpdateProjectService },
        { provide: DeleteProjectService, useValue: mockDeleteProjectService },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get projects for current user on getMyProjects', async () => {
    const res = await controller.getMyProjects(1);
    expect(res).toHaveLength(1);
    expect(res[0].title).toBe('Portfolio Website');
    expect(mockFindProjectsByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get projects by userId on getByUserId', async () => {
    const res = await controller.getByUserId(1);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);
    expect(mockFindProjectsByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get project by ID on getById', async () => {
    const res = await controller.getById(1);
    expect(res.id).toBe(1);
    expect(res.title).toBe('Portfolio Website');
    expect(mockFindProjectByIdService.execute).toHaveBeenCalledWith(1);
  });

  it('should create project on create', async () => {
    const dto: CreateProjectReqDto = {
      title: 'Portfolio Website',
      description: 'A modern portfolio web application.',
    };
    const res = await controller.create(1, dto);
    expect(res.id).toBe(1);
    expect(mockCreateProjectService.execute).toHaveBeenCalledWith(1, dto);
  });

  it('should update project on update', async () => {
    const dto: UpdateProjectReqDto = {
      title: 'Updated Portfolio Website',
    };
    const res = await controller.update(1, 1, dto);
    expect(res.id).toBe(1);
    expect(mockUpdateProjectService.execute).toHaveBeenCalledWith(1, 1, dto);
  });

  it('should delete project on delete', async () => {
    await controller.delete(1, 1);
    expect(mockDeleteProjectService.execute).toHaveBeenCalledWith(1, 1);
  });
});
