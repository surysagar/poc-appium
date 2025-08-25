import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppiumModule } from './modules/appium/appium.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesModule } from './modules/devices/devices.module';
import { TestRunsModule } from './modules/test-runs/test-runs.module';
import { DocumentModule } from './modules/document/document.module';
import { TestScriptsModule } from './modules/test-scripts/test-scripts.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost:27017/appium-node', {}),
    AppiumModule,
    AuthModule,
    UsersModule,
    DevicesModule,
    TestRunsModule,
    DocumentModule,
    TestScriptsModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
