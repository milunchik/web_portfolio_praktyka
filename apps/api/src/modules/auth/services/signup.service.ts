import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupReqDto } from '../dtos/req/signup.req.dto';
import { FindUserByEmailService } from '../../user/services/find-user-by-email.service';
import { CreateUserService } from '../../user/services/create-user.service';
import { PasswordPort } from '../../../shared/domain/ports/password.port';
import { TokenPort } from '../../../shared/domain/ports/token.port';
import { SessionRepository } from '../repositories/session.repository';
import { TokenPair } from '../../../shared/security/token.types';

@Injectable()
export class SignupService {
  constructor(
    private readonly findUserByEmail: FindUserByEmailService,
    private readonly createUser: CreateUserService,
    private readonly passwordPort: PasswordPort,
    private readonly tokenPort: TokenPort,
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(dto: SignupReqDto): Promise<TokenPair> {
    const existing = await this.findUserByEmail.execute(dto.email);
    if (existing)
      throw new BadRequestException('User with this email already exists');

    const hashedPassword = await this.passwordPort.hash(dto.password);

    const newUser = await this.createUser.execute({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role: 'user',
    });

    const tokens = this.tokenPort.generateTokenPair({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    await this.sessionRepository.create({
      userId: newUser.id,
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    });

    return tokens;
  }
}
