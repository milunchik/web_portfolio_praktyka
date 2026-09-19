import { Injectable } from '@nestjs/common';
import { CachePort } from '../../shared/domain/ports';
import { AppConfigService } from '../config';

type CacheEntry<T> = {
  value: T;
  expiresAt?: number;
};

@Injectable()
export class CacheService extends CachePort {
  private store = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly config: AppConfigService) {
    super();
  }

  private get isEnabled(): boolean {
    return this.config.redis.enabled;
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    if (!this.isEnabled) return;

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;

    this.store.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | null {
    if (!this.isEnabled) return null;

    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  delete(key: string): void {
    if (!this.isEnabled) return;

    this.store.delete(key);
  }

  clear(): void {
    if (!this.isEnabled) return;

    this.store.clear();
  }
}
