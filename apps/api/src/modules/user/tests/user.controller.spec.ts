import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import { FindUserByPublicUrlService } from '../services/find-user-by-public-url.service';
import { UpdateUserService } from '../services/update-user.service';
import { GenerateUserCvPdfService } from '../services/generate-user-cv-pdf.service';
import { UpdateEmailService } from '../services/update-email.service';
import { ChangePasswordService } from '../services/change-password.service';
import { DeleteUserService } from '../services/delete-user.service';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { UserEntity } from '../repositories/user.repository';
import { GenerateCvQueryDto } from '../dtos/req/generate-cv-query.dto';
import type { Response } from 'express';

describe('UserController', () => {
  let controller: UserController;

  const mockUser = new UserEntity(
    1,
    'test@example.com',
    'Test User',
    'Test description',
    'hashedPassword',
    'test-user-123',
    'user',
    new Date(),
    new Date(),
  );

  const mockPdfResult = {
    buffer: Buffer.from('%PDF-1.4 mock content'),
    fileName: 'Test_User_CV.pdf',
  };

  const mockFindUserById = {
    execute: jest.fn().mockResolvedValue(mockUser),
  };
  const mockFindUserByPublicUrl = {
    execute: jest.fn().mockResolvedValue(mockUser),
  };
  const mockUpdateUserService = {
    execute: jest.fn().mockResolvedValue(mockUser),
  };
  const mockGenerateUserCvPdfService = {
    executeById: jest.fn().mockResolvedValue(mockPdfResult),
    executeByPublicUrl: jest.fn().mockResolvedValue(mockPdfResult),
  };
  const mockUpdateEmailService = {
    execute: jest.fn().mockResolvedValue(mockUser),
  };
  const mockChangePasswordService = {
    execute: jest.fn().mockResolvedValue({ message: 'Password changed successfully' }),
  };
  const mockDeleteUserService = {
    execute: jest.fn().mockResolvedValue({ message: 'Account deleted successfully' }),
  };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  const createMockResponse = () => {
    const res: Partial<Response> = {};
    res.set = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: FindUserByIdService, useValue: mockFindUserById },
        { provide: FindUserByPublicUrlService, useValue: mockFindUserByPublicUrl },
        { provide: UpdateUserService, useValue: mockUpdateUserService },
        { provide: GenerateUserCvPdfService, useValue: mockGenerateUserCvPdfService },
        { provide: UpdateEmailService, useValue: mockUpdateEmailService },
        { provide: ChangePasswordService, useValue: mockChangePasswordService },
        { provide: DeleteUserService, useValue: mockDeleteUserService },
        { provide: TokenPort, useValue: mockTokenPort },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return safe user on getMe', async () => {
    const res = await controller.getMe(1);
    expect(res.id).toBe(1);
    expect(res.email).toBe('test@example.com');
    expect((res as any).password).toBeUndefined();
  });

  it('should update email and return safe user on updateEmail', async () => {
    const res = await controller.updateEmail(1, { email: 'new@example.com' });
    expect(res.id).toBe(1);
    expect(mockUpdateEmailService.execute).toHaveBeenCalledWith(1, { email: 'new@example.com' });
  });

  it('should change password on changePassword', async () => {
    const res = await controller.changePassword(1, {
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
    });
    expect(res.message).toBe('Password changed successfully');
    expect(mockChangePasswordService.execute).toHaveBeenCalledWith(1, {
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
    });
  });

  it('should delete account on deleteMe', async () => {
    const res = await controller.deleteMe(1);
    expect(res.message).toBe('Account deleted successfully');
    expect(mockDeleteUserService.execute).toHaveBeenCalledWith(1);
  });

  it('should stream CV PDF on getMyCv', async () => {
    const res = createMockResponse();
    const query = new GenerateCvQueryDto();
    await controller.getMyCv(1, query, res);
    expect(mockGenerateUserCvPdfService.executeById).toHaveBeenCalledWith(1, query);
    expect(res.set).toHaveBeenCalledWith(
      expect.objectContaining({
        'Content-Type': 'application/pdf',
      }),
    );
    expect(res.end).toHaveBeenCalledWith(mockPdfResult.buffer);
  });

  it('should stream CV PDF on getPublicCv', async () => {
    const res = createMockResponse();
    const query = new GenerateCvQueryDto();
    await controller.getPublicCv('test-user-123', query, res);
    expect(mockGenerateUserCvPdfService.executeByPublicUrl).toHaveBeenCalledWith('test-user-123', query);
    expect(res.set).toHaveBeenCalled();
    expect(res.end).toHaveBeenCalledWith(mockPdfResult.buffer);
  });

  it('should stream CV PDF on getUserCvById', async () => {
    const res = createMockResponse();
    const query = new GenerateCvQueryDto();
    await controller.getUserCvById(1, query, res);
    expect(mockGenerateUserCvPdfService.executeById).toHaveBeenCalledWith(1, query);
    expect(res.set).toHaveBeenCalled();
    expect(res.end).toHaveBeenCalledWith(mockPdfResult.buffer);
  });

  it('should return safe user on findById', async () => {
    const res = await controller.findById(1);
    expect(res.id).toBe(1);
    expect(res.fullName).toBe('Test User');
  });

  it('should return safe user on getByPublicUrl', async () => {
    const res = await controller.getByPublicUrl('test-user-123');
    expect(res.publicUrl).toBe('test-user-123');
  });

  it('should update user and return safe user on updateMe', async () => {
    const res = await controller.updateMe(1, { description: 'Updated' });
    expect(res.id).toBe(1);
  });
});
