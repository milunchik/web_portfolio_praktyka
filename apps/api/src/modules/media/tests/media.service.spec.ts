import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  CreateMediaService,
  FindMediaByIdService,
  FindMediaByUserService,
  UpdateMediaService,
  DeleteMediaService,
  UploadMediaService,
} from '../services';
import { MediaRepository, MediaEntity } from '../repositories/media.repository';
import { StoragePort } from '../../../shared/domain/ports/storage.port';

describe('Media Services', () => {
  let createMediaService: CreateMediaService;
  let findMediaByIdService: FindMediaByIdService;
  let findMediaByUserService: FindMediaByUserService;
  let updateMediaService: UpdateMediaService;
  let deleteMediaService: DeleteMediaService;
  let uploadMediaService: UploadMediaService;

  const mockMedia = new MediaEntity(
    1,
    1,
    'https://supabase.local/storage/v1/object/public/media/1/photo.jpg',
    'photo.jpg',
    'image/jpeg',
    1024,
    new Date(),
    new Date(),
  );

  const mockMediaRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockStoragePort = {
    upload: jest.fn().mockResolvedValue('https://supabase.local/storage/v1/object/public/media/1/photo.jpg'),
    delete: jest.fn().mockResolvedValue(undefined),
    getPublicUrl: jest.fn().mockReturnValue('https://supabase.local/storage/v1/object/public/media/1/photo.jpg'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMediaService,
        FindMediaByIdService,
        FindMediaByUserService,
        UpdateMediaService,
        DeleteMediaService,
        UploadMediaService,
        { provide: MediaRepository, useValue: mockMediaRepository },
        { provide: StoragePort, useValue: mockStoragePort },
      ],
    }).compile();

    createMediaService = module.get<CreateMediaService>(CreateMediaService);
    findMediaByIdService = module.get<FindMediaByIdService>(FindMediaByIdService);
    findMediaByUserService = module.get<FindMediaByUserService>(FindMediaByUserService);
    updateMediaService = module.get<UpdateMediaService>(UpdateMediaService);
    deleteMediaService = module.get<DeleteMediaService>(DeleteMediaService);
    uploadMediaService = module.get<UploadMediaService>(UploadMediaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateMediaService', () => {
    it('should create a media record successfully', async () => {
      mockMediaRepository.create.mockResolvedValue(mockMedia);
      const result = await createMediaService.execute(1, {
        url: 'https://supabase.local/storage/v1/object/public/media/1/photo.jpg',
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      });
      expect(result).toEqual(mockMedia);
      expect(mockMediaRepository.create).toHaveBeenCalledWith(1, {
        url: 'https://supabase.local/storage/v1/object/public/media/1/photo.jpg',
        fileName: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      });
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
        fileName: expect.stringContaining('test.png'),
        mimeType: 'image/png',
        size: 12,
      });
    });

    it('should throw BadRequestException if file is missing', async () => {
      await expect(uploadMediaService.execute(1, null as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('FindMediaByIdService', () => {
    it('should return a media entity if found', async () => {
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      const result = await findMediaByIdService.execute(1);
      expect(result).toEqual(mockMedia);
      expect(mockMediaRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if media not found', async () => {
      mockMediaRepository.findById.mockResolvedValue(null);
      await expect(findMediaByIdService.execute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('FindMediaByUserService', () => {
    it('should return all medias for user', async () => {
      mockMediaRepository.findByUserId.mockResolvedValue([mockMedia]);
      const result = await findMediaByUserService.execute(1);
      expect(result).toEqual([mockMedia]);
      expect(mockMediaRepository.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('UpdateMediaService', () => {
    it('should update media if found and authorized', async () => {
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      const updatedMedia = new MediaEntity(1, 1, mockMedia.url, 'updated.jpg', mockMedia.mimeType, mockMedia.size);
      mockMediaRepository.update.mockResolvedValue(updatedMedia);
      const result = await updateMediaService.execute(1, 1, { fileName: 'updated.jpg' });
      expect(result.fileName).toBe('updated.jpg');
      expect(mockMediaRepository.update).toHaveBeenCalledWith(1, { fileName: 'updated.jpg' });
    });

    it('should throw NotFoundException if updating non-existent media', async () => {
      mockMediaRepository.findById.mockResolvedValue(null);
      await expect(updateMediaService.execute(1, 999, { fileName: 'updated.jpg' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the media', async () => {
      const otherUserMedia = new MediaEntity(1, 2, mockMedia.url, mockMedia.fileName, mockMedia.mimeType);
      mockMediaRepository.findById.mockResolvedValue(otherUserMedia);
      await expect(updateMediaService.execute(1, 1, { fileName: 'updated.jpg' })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('DeleteMediaService', () => {
    it('should delete media record and remove file from storage', async () => {
      mockMediaRepository.findById.mockResolvedValue(mockMedia);
      mockMediaRepository.delete.mockResolvedValue(undefined);
      await deleteMediaService.execute(1, 1);
      expect(mockMediaRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if media to delete is not found', async () => {
      mockMediaRepository.findById.mockResolvedValue(null);
      await expect(deleteMediaService.execute(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own media to delete', async () => {
      const otherUserMedia = new MediaEntity(1, 2, mockMedia.url, mockMedia.fileName, mockMedia.mimeType);
      mockMediaRepository.findById.mockResolvedValue(otherUserMedia);
      await expect(deleteMediaService.execute(1, 1)).rejects.toThrow(ForbiddenException);
    });
  });
});
