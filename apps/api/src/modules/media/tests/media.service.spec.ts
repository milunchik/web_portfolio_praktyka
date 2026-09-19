import 'multer';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  CreateMediaService,
  UploadMediaService,
  FindMediaByIdService,
  FindMediaByUserService,
  UpdateMediaService,
  DeleteMediaService,
  MediaService,
} from '../services';
import { MediaRepository, MediaEntity } from '../repositories/media.repository';
import { StoragePort } from '../../../shared/domain/ports/storage.port';

describe('Media Services', () => {
  let createMediaService: CreateMediaService;
  let uploadMediaService: UploadMediaService;
  let findMediaByIdService: FindMediaByIdService;
  let findMediaByUserService: FindMediaByUserService;
  let updateMediaService: UpdateMediaService;
  let deleteMediaService: DeleteMediaService;
  let mediaService: MediaService;

  const mockMedia = new MediaEntity(
    1,
    1,
    'https://supabase.local/storage/v1/object/public/media/1/photo.jpg',
    'photo.jpg',
    'image/jpeg',
    1024,
    new Date('2024-01-01T00:00:00.000Z'),
    new Date('2024-01-01T00:00:00.000Z'),
  );

  const mockMediaRepository = {
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockStoragePort = {
    upload: jest.fn().mockResolvedValue('https://supabase.local/storage/v1/object/public/media/1/photo.jpg'),
    delete: jest.fn().mockResolvedValue(undefined),
    getPublicUrl: jest.fn().mockReturnValue('https://supabase.local/storage/v1/object/public/media/1/photo.jpg'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMediaService,
        UploadMediaService,
        FindMediaByIdService,
        FindMediaByUserService,
        UpdateMediaService,
        DeleteMediaService,
        MediaService,
        { provide: MediaRepository, useValue: mockMediaRepository },
        { provide: StoragePort, useValue: mockStoragePort },
      ],
    }).compile();

    createMediaService = module.get<CreateMediaService>(CreateMediaService);
    uploadMediaService = module.get<UploadMediaService>(UploadMediaService);
    findMediaByIdService = module.get<FindMediaByIdService>(FindMediaByIdService);
    findMediaByUserService = module.get<FindMediaByUserService>(FindMediaByUserService);
    updateMediaService = module.get<UpdateMediaService>(UpdateMediaService);
    deleteMediaService = module.get<DeleteMediaService>(DeleteMediaService);
    mediaService = module.get<MediaService>(MediaService);
  });

  describe('CreateMediaService', () => {
    it('should create and return media entity', async () => {
      mockMediaRepository.create.mockResolvedValue(mockMedia);
      const dto = {
        url: 'https://supabase.local/storage/v1/object/public/media/1/photo.jpg',
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      };
      const result = await createMediaService.execute(1, dto);
      expect(result).toEqual(mockMedia);
      expect(mockMediaRepository.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('UploadMediaService', () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: Buffer.from('test-content'),
      size: 12,
    } as Express.Multer.File;

    it('should upload file to storage and create media entity', async () => {
      mockMediaRepository.create.mockResolvedValue(mockMedia);
      const result = await uploadMediaService.execute(1, mockFile);
      expect(result).toEqual(mockMedia);
      expect(mockStoragePort.upload).toHaveBeenCalled();
      expect(mockMediaRepository.create).toHaveBeenCalledWith(1, {
        url: 'https://supabase.local/storage/v1/object/public/media/1/photo.jpg',
        fileName: 'test.png',
        mimeType: 'image/png',
        size: 12,
      });
    });

    it('should throw BadRequestException if file is missing', async () => {
      await expect(uploadMediaService.execute(1, null as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('FindMediaByIdService', () => {
    it('should return media if found', async () => {
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      const result = await findMediaByIdService.execute(1);
      expect(result).toEqual(mockMedia);
      expect(mockMediaRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockMediaRepository.findById.mockResolvedValue(null);
      await expect(findMediaByIdService.execute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindMediaByUserService', () => {
    it('should return medias for user', async () => {
      mockMediaRepository.findByUserId.mockResolvedValue([mockMedia]);
      const result = await findMediaByUserService.execute(1);
      expect(result).toEqual([mockMedia]);
      expect(mockMediaRepository.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('UpdateMediaService', () => {
    it('should update and return updated media', async () => {
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      mockMediaRepository.update.mockResolvedValue(mockMedia);
      const dto = { url: 'https://supabase.local/new.jpg' };
      const result = await updateMediaService.execute(1, 1, dto);
      expect(result).toEqual(mockMedia);
      expect(mockMediaRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if media does not exist', async () => {
      mockMediaRepository.findById.mockResolvedValue(null);
      await expect(updateMediaService.execute(1, 999, { url: 'https://new.jpg' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if media belongs to another user', async () => {
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      await expect(updateMediaService.execute(2, 1, { url: 'https://new.jpg' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteMediaService', () => {
    it('should delete media successfully and attempt storage cleanup', async () => {
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      mockMediaRepository.delete.mockResolvedValue(undefined);
      await deleteMediaService.execute(1, 1);
      expect(mockStoragePort.delete).toHaveBeenCalledWith('1/photo.jpg', 'media');
      expect(mockMediaRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if media does not exist', async () => {
      mockMediaRepository.findById.mockResolvedValue(null);
      await expect(deleteMediaService.execute(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if media belongs to another user', async () => {
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      await expect(deleteMediaService.execute(2, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('MediaService facade', () => {
    it('should delegate create, upload, findById, findByUserId, update, delete', async () => {
      mockMediaRepository.create.mockResolvedValue(mockMedia);
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      mockMediaRepository.findByUserId.mockResolvedValue([mockMedia]);
      mockMediaRepository.update.mockResolvedValue(mockMedia);
      mockMediaRepository.delete.mockResolvedValue(undefined);

      const dto = {
        url: 'https://supabase.local/storage/v1/object/public/media/1/photo.jpg',
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      };

      expect(await mediaService.create(1, dto)).toEqual(mockMedia);
      expect(await mediaService.findById(1)).toEqual(mockMedia);
      expect(await mediaService.findByUserId(1)).toEqual([mockMedia]);
      expect(await mediaService.update(1, 1, { url: 'https://new.jpg' })).toEqual(mockMedia);
      await expect(mediaService.delete(1, 1)).resolves.toBeUndefined();
    });
  });
});
