import { Module } from '@nestjs/common';
import { ProxyModule } from './proxy/proxy.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ProxyModule, HealthModule],
})
export class AppModule {}