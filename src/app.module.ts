import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TravelRoomModule } from './travel-room/travel-room.module';
import { AWSModule } from './aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AccountModule,
    HealthCheckModule,
    AuthModule,
    TravelRoomModule,
    AWSModule
  ],
  providers: []
})
export class AppModule {}
