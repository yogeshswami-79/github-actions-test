import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { BstService } from './bst/bst.service.js';

function parseData(value: unknown): number {
  const data = Number(value);
  if (Number.isNaN(data)) {
    throw new BadRequestException('data must be a number');
  }
  return data;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly bstService: BstService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('bst')
  async getInOrder(): Promise<Number[]> {
    return this.bstService.inOrder();
  }

  @Get('bst/:data')
  async contains(@Param('data') data: string): Promise<{ contains: boolean }> {
    return { contains: await this.bstService.contains(parseData(data)) };
  }

  @Post('bst')
  async insert(@Body('data') data: unknown): Promise<{ inserted: number }> {
    const parsed = parseData(data);
    await this.bstService.insert(parsed);
    return { inserted: parsed };
  }

  @Delete('bst/:data')
  async removeLeaf(@Param('data') data: string): Promise<{ removed: number }> {
    const parsed = parseData(data);
    await this.bstService.removeLeaf(parsed);
    return { removed: parsed };
  }
}
