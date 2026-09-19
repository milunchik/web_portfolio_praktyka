import { Test, TestingModule } from '@nestjs/testing';
import { SigninService } from '../services/signin.service';
import { FindUserByEmailService } from '../../user/services/find-user-by-email.service';
import { PasswordPort } from '../../../shared/domain/ports/password.port';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { SessionRepository } from '../repositories/session.repository';

describe('SigninService', () => {
  let service: SigninService;

  const mockFindUserByEmail = { execute: jest.fn() };
  const mockPasswordPort = { hash: jest.fn(), compare: jest.fn() };
  const mockTokenPort = {
    generateTokenPair: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };
  const mockSessionRepository = {
    findById: jest.fn(),
    findByRefreshToken: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    deleteAllByUserId: jest.fn(),
    deleteExpired: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SigninService,
        { provide: FindUserByEmailService, useValue: mockFindUserByEmail },
        { provide: PasswordPort, useValue: mockPasswordPort },
        { provide: TokenPort, useValue: mockTokenPort },
        { provide: SessionRepository, useValue: mockSessionRepository },
      ],
    }).compile();

    service = module.get<SigninService>(SigninService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
