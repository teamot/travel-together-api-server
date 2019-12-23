import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AccountModule,
    HealthCheckModule,
    AuthModule
  ],
  providers: []
})
export class AppModule {}
