import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App') // Group this under 'App' in Swagger
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get a welcome message' }) // Swagger summary
  @ApiResponse({ status: 200, description: 'Returns the welcome message.' }) // Successful response documentation
  async getHello(): Promise<string> {
    try {
      return await this.appService.getHello();
    } catch (error) {
      throw error;
    }
  }
}
