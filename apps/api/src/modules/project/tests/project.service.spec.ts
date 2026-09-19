import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  CreateProjectService,
  FindProjectByIdService,
  FindProjectsByUserService,
  UpdateProjectService,
  DeleteProjectService,
  ProjectService,
} from '../services';
import { ProjectRepository, ProjectEntity } from '../repositories/project.repository';

describe('Project Services', () => {
  let createProjectService: CreateProjectService;
  let findProjectByIdService: FindProjectByIdService;
  let findProjectsByUserService: FindProjectsByUserService;
  let updateProjectService: UpdateProjectService;
  let deleteProjectService: DeleteProjectService;
  let projectService: ProjectService;

  const mockProject = new ProjectEntity(
    1,
    1,
    'Portfolio Website',
    'A modern portfolio web application.',
    new Date('2024-01-01T00:00:00.000Z'),
    new Date('2024-01-01T00:00:00.000Z'),
  );

  const mockProjectRepository = {
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
        CreateProjectService,
        FindProjectByIdService,
        FindProjectsByUserService,
        UpdateProjectService,
        DeleteProjectService,
        ProjectService,
        { provide: ProjectRepository, useValue: mockProjectRepository },
      ],
    }).compile();

    createProjectService = module.get<CreateProjectService>(CreateProjectService);
    findProjectByIdService = module.get<FindProjectByIdService>(FindProjectByIdService);
    findProjectsByUserService = module.get<FindProjectsByUserService>(FindProjectsByUserService);
    updateProjectService = module.get<UpdateProjectService>(UpdateProjectService);
    deleteProjectService = module.get<DeleteProjectService>(DeleteProjectService);
    projectService = module.get<ProjectService>(ProjectService);
  });

  describe('CreateProjectService', () => {
    it('should create and return project entity', async () => {
      mockProjectRepository.create.mockResolvedValue(mockProject);
      const dto = {
        title: 'Portfolio Website',
        description: 'A modern portfolio web application.',
      };
      const result = await createProjectService.execute(1, dto);
      expect(result).toEqual(mockProject);
      expect(mockProjectRepository.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('FindProjectByIdService', () => {
    it('should return project if found', async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      const result = await findProjectByIdService.execute(1);
      expect(result).toEqual(mockProject);
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockProjectRepository.findById.mockResolvedValue(null);
      await expect(findProjectByIdService.execute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindProjectsByUserService', () => {
    it('should return projects for user', async () => {
      mockProjectRepository.findByUserId.mockResolvedValue([mockProject]);
      const result = await findProjectsByUserService.execute(1);
      expect(result).toEqual([mockProject]);
      expect(mockProjectRepository.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('UpdateProjectService', () => {
    it('should update and return updated project', async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockProjectRepository.update.mockResolvedValue(mockProject);
      const dto = { title: 'Updated Website' };
      const result = await updateProjectService.execute(1, 1, dto);
      expect(result).toEqual(mockProject);
      expect(mockProjectRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockProjectRepository.findById.mockResolvedValue(null);
      await expect(updateProjectService.execute(1, 999, { title: 'Updated' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if project belongs to another user', async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      await expect(updateProjectService.execute(2, 1, { title: 'Updated' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteProjectService', () => {
    it('should delete project successfully', async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockProjectRepository.delete.mockResolvedValue(undefined);
      await deleteProjectService.execute(1, 1);
      expect(mockProjectRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockProjectRepository.findById.mockResolvedValue(null);
      await expect(deleteProjectService.execute(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if project belongs to another user', async () => {
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      await expect(deleteProjectService.execute(2, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ProjectService facade', () => {
    it('should delegate create, findById, findByUserId, update, delete', async () => {
      mockProjectRepository.create.mockResolvedValue(mockProject);
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockProjectRepository.findByUserId.mockResolvedValue([mockProject]);
      mockProjectRepository.update.mockResolvedValue(mockProject);
      mockProjectRepository.delete.mockResolvedValue(undefined);

      const dto = {
        title: 'Portfolio Website',
        description: 'A modern portfolio web application.',
      };

      expect(await projectService.create(1, dto)).toEqual(mockProject);
      expect(await projectService.findById(1)).toEqual(mockProject);
      expect(await projectService.findByUserId(1)).toEqual([mockProject]);
      expect(await projectService.update(1, 1, { title: 'Updated' })).toEqual(mockProject);
      await expect(projectService.delete(1, 1)).resolves.toBeUndefined();
    });
  });
});
