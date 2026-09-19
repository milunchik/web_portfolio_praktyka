import 'multer';
import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from '../controllers/media.controller';
import {
  CreateMediaService,
  UploadMediaService,
  FindMediaByIdService,
  FindMediaByUserService,
  UpdateMediaService,
  DeleteMediaService,
} from '../services';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { MediaEntity } from '../repositories/media.repository';
import { CreateMediaReqDto, UpdateMediaReqDto } from '../dtos/req';

describe('MediaController', () => {
  let controller: MediaController;

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

  const mockCreateMediaService = {
    execute: jest.fn().mockResolvedValue(mockMedia),
  };
  const mockUploadMediaService = {
    execute: jest.fn().mockResolvedValue(mockMedia),
  };
  const mockFindMediaByIdService = {
    execute: jest.fn().mockResolvedValue(mockMedia),
  };
  const mockFindMediaByUserService = {
    execute: jest.fn().mockResolvedValue([mockMedia]),
  };
  const mockUpdateMediaService = {
    execute: jest.fn().mockResolvedValue(mockMedia),
  };
  const mockDeleteMediaService = {
    execute: jest.fn().mockResolvedValue(undefined),
  };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        { provide: CreateMediaService, useValue: mockCreateMediaService },
        { provide: UploadMediaService, useValue: mockUploadMediaService },
        { provide: FindMediaByIdService, useValue: mockFindMediaByIdService },
        { provide: FindMediaByUserService, useValue: mockFindMediaByUserService },
        { provide: UpdateMediaService, useValue: mockUpdateMediaService },
        { provide: DeleteMediaService, useValue: mockDeleteMediaService },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get media for current user on getMyMedia', async () => {
    const res = await controller.getMyMedia(1);
    expect(res).toHaveLength(1);
    expect(res[0].url).toContain('photo.jpg');
    expect(mockFindMediaByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get media by userId on getByUserId', async () => {
    const res = await controller.getByUserId(1);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(1);
    expect(mockFindMediaByUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should get media by ID on getById', async () => {
    const res = await controller.getById(1);
    expect(res.id).toBe(1);
    expect(res.fileName).toBe('photo.jpg');
    expect(mockFindMediaByIdService.execute).toHaveBeenCalledWith(1);
  });

  it('should create media on create', async () => {
    const dto: CreateMediaReqDto = {
      url: 'https://supabase.local/storage/v1/object/public/media/1/photo.jpg',
      fileName: 'photo.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
    };
    const res = await controller.create(1, dto);
    expect(res.id).toBe(1);
    expect(mockCreateMediaService.execute).toHaveBeenCalledWith(1, dto);
  });

  it('should upload media file on upload', async () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'photo.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test'),
      size: 4,
    } as Express.Multer.File;

    const res = await controller.upload(1, mockFile, {});
    expect(res.id).toBe(1);
    expect(mockUploadMediaService.execute).toHaveBeenCalledWith(1, mockFile, {});
  });

  it('should update media on update', async () => {
    const dto: UpdateMediaReqDto = {
      url: 'https://supabase.local/storage/v1/object/public/media/1/new-photo.jpg',
    };
    const res = await controller.update(1, 1, dto);
    expect(res.id).toBe(1);
    expect(mockUpdateMediaService.execute).toHaveBeenCalledWith(1, 1, dto);
  });

  it('should delete media on delete', async () => {
    await controller.delete(1, 1);
    expect(mockDeleteMediaService.execute).toHaveBeenCalledWith(1, 1);
  });
});
