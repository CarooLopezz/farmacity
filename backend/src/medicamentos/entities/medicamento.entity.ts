import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity.js';

@Entity('medicamentos')
export class Medicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  precio: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ length: 100 })
  laboratorio: string;

  @Column({ type: 'date' })
  fechaVencimiento: string;

  @Column()
  categoriaId: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.medicamentos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoriaId' })
  categoria: Relation<Categoria>;
}