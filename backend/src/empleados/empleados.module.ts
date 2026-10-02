import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service.js';
import { EmpleadosController } from './empleados.controller.js';
import { Empleado } from './entities/empleado.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
})
export class EmpleadosModule {}
