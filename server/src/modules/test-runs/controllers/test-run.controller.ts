import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TestRunService } from '../services/test-run.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FilterTestRunDto } from '../dto/filterTestRuns.dto';
import { CreateTestRunDto } from '../dto/createTestRun.dto';
import { join } from 'path';
import * as fs from 'fs';

@ApiTags('Test Run')
@Controller({ path: 'test-run', version: '1' })
export class TestRunController {
  constructor(private readonly testRunService: TestRunService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Create a new test run' })
  @ApiBody({
    description: 'Data to create a test run',
    type: CreateTestRunDto,
  })
  @ApiResponse({ status: 201, description: 'Test run created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createTestRun(@Request() req, @Body() body: CreateTestRunDto) {
    try {
      const user = req.user;
      const testRun = await this.testRunService.create(body, user.userId);
      return testRun;
    } catch (error) {
      throw error;
    }
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get all test runs with filters' })
  @ApiBody({
    description: 'Filters to get the list of test runs',
    type: FilterTestRunDto,
  })
  @ApiResponse({
    status: 200,
    description: 'List of test runs retrieved successfully',
  })
  async getAllTestRuns(@Body() body: FilterTestRunDto) {
    try {
      const result = await this.testRunService.findallTestRuns(body);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Get('report/:id')
  @ApiOperation({
    summary: 'Get Allure Report by Test ID',
    description:
      'Fetches and returns the Allure report HTML file for a specific test run identified by the `id` parameter.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier for the test report',
    example: '12345', // Example testId
  })
  @ApiResponse({
    status: 200,
    description: 'The HTML file of the Allure report is returned successfully.',
    content: {
      'text/html': {
        example:
          '<!DOCTYPE html><html><head><title>Allure Report</title></head><body>...</body></html>',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getReport(@Param('id') id: string, @Res() res) {
    try {
      const filePath = join(process.cwd(), 'reports', id, 'index.html');

      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Report not found');
      }

      const readStream = fs.createReadStream(filePath);

      res
        .code(HttpStatus.OK)
        .headers('Content-Type', 'text/html; charset=UTF-8')
        .send(readStream);
    } catch (error) {
      throw error;
    }
  }

  @Get('logs/:id')
  @ApiOperation({
    summary: 'Retrieve log or report file',
    description: `
      This endpoint retrieves the requested log or report file based on the given ID and type.
      - If the type is 'appium' or 'wdio', it will return the corresponding .log file.
      - If no valid file is found, it returns a 404 error.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier for the test session or report folder.',
    type: String,
  })
  @ApiQuery({
    name: 'type',
    description: `The type of log file to retrieve. Allowed values: 'appium' or 'wdio'.`,
    enum: ['appium', 'wdio'],
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The log or report file is successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The requested log or report file is not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters.',
  })
  async getLogs(
    @Param('id') id: string,
    @Query('type') type: string,
    @Res() res: any,
  ) {
    try {
      // Validate the type query parameter
      if (!['appium', 'wdio'].includes(type)) {
        throw new BadRequestException(
          `Invalid type. Allowed values are 'appium' or 'wdio'.`,
        );
      }

      // Determine the file path based on type
      const fileName = type === 'appium' ? 'appium.log' : 'wdio.log';
      const filePath = join(process.cwd(), 'logs', id, fileName);

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Log file not found');
      }

      // Create a read stream for the file
      const readStream = fs.createReadStream(filePath);

      // Set response headers and send the file
      res
        .code(HttpStatus.OK)
        .headers('Content-Type', 'text/plain; charset=UTF-8')
        .send(readStream);
    } catch (error) {
      throw error;
    }
  }
}
