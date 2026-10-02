import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80 })
  nombre: string;

  @Column({ length: 80 })
  apellido: string;

  @Column({ length: 8, unique: true })
  dni: string;

  @Column({ length: 120, unique: true })
  email: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 60 })
  cargo: string;

  @Column({ type: 'date' })
  fechaIngreso: string;
}

