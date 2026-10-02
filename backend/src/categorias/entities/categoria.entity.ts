import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type Relation } from 'typeorm';
import { Medicamento } from '../../medicamentos/entities/medicamento.entity.js';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @OneToMany(() => Medicamento, (medicamento) => medicamento.categoria)
  medicamentos: Relation<Medicamento[]>;
}