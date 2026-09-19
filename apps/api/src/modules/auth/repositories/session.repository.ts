export class SessionEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly refreshToken: string,
    public readonly accessToken: string,
    public readonly accessTokenExpiresAt: Date | null,
    public readonly refreshTokenExpiresAt: Date | null,
    public readonly deviceId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export interface CreateSessionData {
  userId: number;
  refreshToken: string;
  accessToken: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  deviceId?: string;
}

export interface UpdateSessionData {
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
}

export abstract class SessionRepository {
  abstract findById(id: number): Promise<SessionEntity | null>;
  abstract findByRefreshToken(token: string): Promise<SessionEntity | null>;
  abstract create(data: CreateSessionData): Promise<SessionEntity>;
  abstract update(id: number, data: UpdateSessionData): Promise<SessionEntity>;
  abstract deleteById(id: number): Promise<void>;
  abstract deleteAllByUserId(userId: number): Promise<void>;
  abstract deleteExpired(): Promise<void>;
}
