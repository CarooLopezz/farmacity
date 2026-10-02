import { Test, TestingModule } from '@nestjs/testing';
import { MedicamentosController } from './medicamentos.controller.js';
import { MedicamentosService } from './medicamentos.service.js';

describe('MedicamentosController', () => {
  let controller: MedicamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicamentosController],
      providers: [MedicamentosService],
    }).compile();

    controller = module.get<MedicamentosController>(MedicamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
