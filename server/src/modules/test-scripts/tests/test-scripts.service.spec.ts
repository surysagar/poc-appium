import { Test, TestingModule } from '@nestjs/testing';
import { TestScriptsService } from './test-scripts.service';

describe('TestScriptsService', () => {
  let service: TestScriptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestScriptsService],
    }).compile();

    service = module.get<TestScriptsService>(TestScriptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
