export abstract class CachePort {
  abstract get<T>(key: string): T | null;
  abstract set<T>(key: string, value: T, ttlSeconds?: number): void;
  abstract delete(key: string): void;
  abstract clear(): void;
}
