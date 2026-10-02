import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service.js';
import { EmpleadosController } from './empleados.controller.js';

@Module({
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
})
export class EmpleadosModule {}
