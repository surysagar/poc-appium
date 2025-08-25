import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  NotFoundException, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TestScriptsService } from '../services/test-scripts.service';
import { TestScript } from '../schemas/test-script.schema';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateTestScriptDto } from '../dto/createTestScript.dto';
import { UpdateTestScriptDto } from '../dto/updateTestScript.dto';



@ApiTags('Test Scripts') // Group for Swagger
@ApiBearerAuth('jwt-auth') // JWT authentication for Swagger
@Controller({ path: 'test-scripts', version: '1' }) // API versioning
export class TestScriptsController {
  constructor(private readonly testScriptsService: TestScriptsService) {}

  // Create a new TestScript
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new test script' })
  @ApiBody({ description: 'Data to create a test script', type: CreateTestScriptDto })
  @ApiResponse({ status: 201, description: 'Test script created successfully', type: TestScript })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @Request() req,
    @Body() createTestScriptDto: CreateTestScriptDto
  ): Promise<TestScript> {
    const created_by = req.user.id;  // Assuming user ID from JWT token
    return await this.testScriptsService.create(createTestScriptDto, created_by);
  }

  // Retrieve all TestScripts
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve all test scripts' })
  @ApiResponse({ status: 200, description: 'List of test scripts retrieved successfully', type: [TestScript] })
  async findAll(): Promise<TestScript[]> {
    return await this.testScriptsService.findAll();
  }

  // Retrieve a single TestScript by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve a single test script by ID' })
  @ApiResponse({ status: 200, description: 'Test script retrieved successfully', type: TestScript })
  @ApiResponse({ status: 404, description: 'Test script not found' })
  async findOne(@Param('id') id: string): Promise<TestScript> {
    const testScript = await this.testScriptsService.findOne(id);
    if (!testScript) {
      throw new NotFoundException(`TestScript with ID ${id} not found`);
    }
    return testScript;
  }

  // Update a TestScript by ID
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a test script by ID' })
  @ApiBody({ description: 'Data to update a test script', type: UpdateTestScriptDto })
  @ApiResponse({ status: 200, description: 'Test script updated successfully', type: TestScript })
  @ApiResponse({ status: 404, description: 'Test script not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTestScriptDto,
    @Request() req
  ): Promise<TestScript> {
    const updated_by = req.user.id;
    return await this.testScriptsService.update(id, updateDto, updated_by);
  }

  // Delete a TestScript by ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a test script by ID' })
  @ApiResponse({ status: 200, description: 'Test script deleted successfully', type: TestScript })
  @ApiResponse({ status: 404, description: 'Test script not found' })
  async delete(@Param('id') id: string): Promise<TestScript> {
    return await this.testScriptsService.delete(id);
  }
}
