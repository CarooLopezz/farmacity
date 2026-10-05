import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicamentosService } from './medicamentos.service.js';
import { MedicamentosController } from './medicamentos.controller.js';
import { Medicamento } from './entities/medicamento.entity.js';
import { Categoria } from '../categorias/entities/categoria.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Medicamento, Categoria])],
  controllers: [MedicamentosController],
  providers: [MedicamentosService],
})
export class MedicamentosModule {}