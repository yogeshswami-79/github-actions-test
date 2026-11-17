import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BstService } from './bst/bst.service.js';
import { HealthController } from './health/health.controller.js';
import { redisProvider } from './redis/redis.provider.js';

@Module({
  imports: [],
  controllers: [AppController, HealthController],
  providers: [AppService, BstService, redisProvider],
})
export class AppModule {}
// wom3 ewlnfefw