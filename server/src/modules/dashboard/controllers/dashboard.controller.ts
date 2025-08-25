import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('Dashboard') // Grouping under 'Dashboard' in Swagger
@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get a summary of dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary returned successfully.',
    schema: {
      example: {
        deviceList: { Android: 5, iOS: 2 },
        testScript: 10,
        testRunSuccess: 3,
        testRunFailure: 2,
      },
    },
  })
  async getDashboardSummary() {
    return this.dashboardService.getDashboardSummary();
  }

  @Get('weeklysummary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get daily test run summary statistics' })
  @ApiResponse({
    status: 200,
    description: 'Daily test run summary returned successfully.',
    schema: {
      example: [
        { day: 'Monday', date: '01/11/24', running: 5, passed: 2, failed: 3 },
        { day: 'Tuesday', date: '02/11/24', running: 6, passed: 1, failed: 2 },
      ],
    },
  })
  async getDailyTestRunSummary() {
    return this.dashboardService.getWeeklyTestRunSummary();
  }
}
