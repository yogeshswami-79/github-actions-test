import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { REDIS_CLIENT } from '../redis/redis.provider.js';
import { BstService } from './bst.service.js';

const REDIS_KEY = 'bst:tree';

describe('BstService', () => {
  let redis: { get: ReturnType<typeof vi.fn>; set: ReturnType<typeof vi.fn> };
  let service: BstService;

  beforeEach(async () => {
    redis = {
      get: vi.fn(),
      set: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BstService, { provide: REDIS_CLIENT, useValue: redis }],
    }).compile();

    service = module.get<BstService>(BstService);
  });

  describe('insert', () => {
    it('creates a new tree when none exists in redis', async () => {
      redis.get.mockResolvedValue(null);

      await service.insert(50);

      expect(redis.get).toHaveBeenCalledWith(REDIS_KEY);
      expect(redis.set).toHaveBeenCalledWith(
        REDIS_KEY,
        JSON.stringify({ data: 50, left: null, right: null }),
      );
    });

    it('inserts into an existing tree loaded from redis', async () => {
      redis.get.mockResolvedValue(
        JSON.stringify({ data: 50, left: null, right: null }),
      );

      await service.insert(30);

      expect(redis.set).toHaveBeenCalledWith(
        REDIS_KEY,
        JSON.stringify({
          data: 50,
          left: { data: 30, left: null, right: null },
          right: null,
        }),
      );
    });
  });

  describe('removeLeaf', () => {
    it('removes a leaf node and saves the result', async () => {
      redis.get.mockResolvedValue(
        JSON.stringify({
          data: 50,
          left: { data: 30, left: null, right: null },
          right: null,
        }),
      );

      await service.removeLeaf(30);

      expect(redis.set).toHaveBeenCalledWith(
        REDIS_KEY,
        JSON.stringify({ data: 50, left: null, right: null }),
      );
    });

    it('leaves a node with children untouched', async () => {
      const tree = {
        data: 50,
        left: { data: 30, left: null, right: null },
        right: null,
      };
      redis.get.mockResolvedValue(JSON.stringify(tree));

      await service.removeLeaf(50);

      expect(redis.set).toHaveBeenCalledWith(REDIS_KEY, JSON.stringify(tree));
    });
  });

  describe('contains', () => {
    it('returns true when the value is present', async () => {
      redis.get.mockResolvedValue(
        JSON.stringify({
          data: 50,
          left: { data: 30, left: null, right: null },
          right: null,
        }),
      );

      await expect(service.contains(30)).resolves.toBe(true);
    });

    it('returns false when the value is absent', async () => {
      redis.get.mockResolvedValue(
        JSON.stringify({ data: 50, left: null, right: null }),
      );

      await expect(service.contains(99)).resolves.toBe(false);
    });

    it('returns false for an empty tree', async () => {
      redis.get.mockResolvedValue(null);

      await expect(service.contains(1)).resolves.toBe(false);
    });
  });

  describe('inOrder', () => {
    it('returns values in sorted order', async () => {
      redis.get.mockResolvedValue(
        JSON.stringify({
          data: 50,
          left: { data: 30, left: null, right: null },
          right: { data: 70, left: null, right: null },
        }),
      );

      await expect(service.inOrder()).resolves.toEqual([30, 50, 70]);
    });

    it('returns an empty array for an empty tree', async () => {
      redis.get.mockResolvedValue(null);

      await expect(service.inOrder()).resolves.toEqual([]);
    });
  });
});
