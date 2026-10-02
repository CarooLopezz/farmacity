import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service.js';
import { MedicamentosController } from './medicamentos.controller.js';
import { Medicamento } from './entities/medicamento.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Medicamento])],
  controllers: [MedicamentosController],
  providers: [MedicamentosService],
})
export class MedicamentosModule {}
