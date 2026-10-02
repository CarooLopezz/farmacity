import { TypeOrmModule } from '@nestjs/typeorm'; //se agregó este modulo
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoriasModule } from './categorias/categorias.module.js';
import { MedicamentosModule } from './medicamentos/medicamentos.module.js';
import { EmpleadosModule } from './empleados/empleados.module.js';



@Module({// y esto también se agregó
  imports: [
    TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'farmacia',
  password: 'farmacia123',
  database: 'farmacia_db',
  autoLoadEntities: true,
  synchronize: true,
}),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
   
    CategoriasModule,
    MedicamentosModule,
    EmpleadosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
