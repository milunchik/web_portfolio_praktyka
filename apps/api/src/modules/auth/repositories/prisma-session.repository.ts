import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma/prisma.service';
import {
  SessionRepository,
  CreateSessionData,
  UpdateSessionData,
  SessionEntity,
} from './session.repository';

@Injectable()
export class PrismaSessionRepository extends SessionRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private toEntity(session: Session): SessionEntity {
    return new SessionEntity(
      session.id,
      session.userId,
      session.refreshToken,
      session.accessToken,
      session.accessTokenExpiresAt ?? null,
      session.refreshTokenExpiresAt ?? null,
      session.deviceId ?? null,
      session.createdAt,
      session.updatedAt,
    );
  }

  async findById(id: number): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findFirst({ where: { id } });
    return session ? this.toEntity(session) : null;
  }

  async findByRefreshToken(token: string): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findFirst({
      where: { refreshToken: token },
    });
    return session ? this.toEntity(session) : null;
  }

  async create(data: CreateSessionData): Promise<SessionEntity> {
    const session = await this.prisma.session.create({ data });
    return this.toEntity(session);
  }

  async update(id: number, data: UpdateSessionData): Promise<SessionEntity> {
    const session = await this.prisma.session.update({
      where: { id },
      data,
    });
    return this.toEntity(session);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.session.delete({ where: { id } });
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    await this.prisma.session.deleteMany({ where: { userId } });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { refreshTokenExpiresAt: { lt: new Date() } },
    });
  }
}
