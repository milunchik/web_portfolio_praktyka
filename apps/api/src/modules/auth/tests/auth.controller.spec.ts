import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { SigninService } from '../services/signin.service';
import { SignupService } from '../services/signup.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { LogoutService } from '../services/logout.service';
import { JwtAuthGuard } from '../../../shared/guards';

describe('AuthController', () => {
  let controller: AuthController;

  const mockSignin = { execute: jest.fn() };
  const mockSignup = { execute: jest.fn() };
  const mockRefresh = { execute: jest.fn() };
  const mockLogout = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: SigninService, useValue: mockSignin },
        { provide: SignupService, useValue: mockSignup },
        { provide: RefreshTokenService, useValue: mockRefresh },
        { provide: LogoutService, useValue: mockLogout },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
