import {
  Controller,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AppiumService } from '../services/appium.service';
import { RunTestDto } from '../dto/RunTest.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller({ path: 'appium', version: '1' })
export class AppiumController {
  private readonly logger = new Logger(AppiumController.name);

  constructor(private readonly appiumService: AppiumService) {}

  // @Post('run-test')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Run Appium Test' }) // Swagger summary
  @ApiResponse({ status: 201, description: 'Test started successfully.' }) // Successful response documentation
  @ApiResponse({ status: 500, description: 'Internal server error.' }) // Error response documentation
  @ApiBody({
    description: 'Request payload to start an Appium test',
    type: RunTestDto,
    examples: {
      example1: {
        summary: 'Sample input for running an Appium test',
        value: {
          platform: 'Android',
          deviceName: 'emulator-5554',
          port: 4725,
          scriptType: 'File',
          scriptName: 'test-script.js',
        },
      },
    },
  })
  async runTest(
    @Body()
    body: RunTestDto,
  ) {
    this.logger.log(
      `Received test run request for device: ${body.deviceName}, port: ${body.port}`,
    );

    try {
      // Log the received body to review the input payload
      this.logger.debug(`Received request body: ${JSON.stringify(body)}`);

      // Call the AppiumService to run the test
      const response = await this.appiumService.runTestOnDevice(body);

      // Return the response after the test execution
      return {
        message: 'Test started successfully',
        data: response,
      };
    } catch (error) {
      this.logger.error(
        `Error running test on device ${body.deviceName}: ${error.message}`,
      );

      // Throw a HttpException with appropriate status code and message
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error:
            'An error occurred while running the test. Please check the logs for more details.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
