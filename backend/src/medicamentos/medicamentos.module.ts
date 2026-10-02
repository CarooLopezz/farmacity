import { Module } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service.js';
import { MedicamentosController } from './medicamentos.controller.js';

@Module({
  controllers: [MedicamentosController],
  providers: [MedicamentosService],
})
export class MedicamentosModule {}
