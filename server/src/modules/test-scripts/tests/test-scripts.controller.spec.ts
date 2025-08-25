import { Test, TestingModule } from '@nestjs/testing';
import { TestScriptsController } from './test-scripts.controller';

describe('TestScriptsController', () => {
  let controller: TestScriptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestScriptsController],
    }).compile();

    controller = module.get<TestScriptsController>(TestScriptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
