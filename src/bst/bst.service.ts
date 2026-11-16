import { Inject, Injectable } from '@nestjs/common';
import type { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.provider.js';
import { BinaryTree, Node } from '../structures/Node.js';

const REDIS_KEY = 'bst:tree';

@Injectable()
export class BstService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private async loadTree(): Promise<BinaryTree> {
    const raw = await this.redis.get(REDIS_KEY);
    const tree = new BinaryTree();
    tree.root = raw ? (JSON.parse(raw) as Node | null) : null;
    return tree;
  }

  private async saveTree(tree: BinaryTree): Promise<void> {
    await this.redis.set(REDIS_KEY, JSON.stringify(tree.root));
  }

  async insert(data: number): Promise<void> {
    const tree = await this.loadTree();
    tree.insert(data);
    await this.saveTree(tree);
  }

  async removeLeaf(data: number): Promise<void> {
    const tree = await this.loadTree();
    tree.removeLeaf(data);
    await this.saveTree(tree);
  }

  async contains(data: number): Promise<boolean> {
    const tree = await this.loadTree();
    return tree.contains(data);
  }

  async inOrder(): Promise<Number[]> {
    const tree = await this.loadTree();
    return tree.inOrder();
  }
}
