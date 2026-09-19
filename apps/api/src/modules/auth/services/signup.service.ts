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

  private generatePublicUrl(name: string): string {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${slug || 'user'}-${randomSuffix}`;
  }

  async execute(dto: SignupReqDto): Promise<TokenPair> {
    const existing = await this.findUserByEmail.execute(dto.email);
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await this.passwordPort.hash(dto.password);

    const newUser = await this.createUser.execute({
      email: dto.email,
      fullName: dto.name,
      password: hashedPassword,
      publicUrl: this.generatePublicUrl(dto.name),
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
