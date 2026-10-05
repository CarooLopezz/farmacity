import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicamento } from './entities/medicamento.entity.js';
import { Categoria } from '../categorias/entities/categoria.entity.js';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto.js';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto.js';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectRepository(Medicamento)
    private readonly repo: Repository<Medicamento>,
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  private async verificarCategoria(categoriaId: number) {
    const categoria = await this.categoriaRepo.findOne({ where: { id: categoriaId } });
    if (!categoria) throw new BadRequestException(`La categoría ${categoriaId} no existe`);
  }

  async create(dto: CreateMedicamentoDto) {
    await this.verificarCategoria(dto.categoriaId);
    const medicamento = this.repo.create(dto);
    const guardado = await this.repo.save(medicamento);
    return this.findOne(guardado.id);
  }

  findAll() {
    return this.repo.find({
      relations: { categoria: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const medicamento = await this.repo.findOne({
      where: { id },
      relations: { categoria: true },
    });
    if (!medicamento) throw new NotFoundException(`Medicamento ${id} no encontrado`);
    return medicamento;
  }

  async update(id: number, dto: UpdateMedicamentoDto) {
    if (dto.categoriaId) await this.verificarCategoria(dto.categoriaId);
    const medicamento = await this.repo.preload({ id, ...dto });
    if (!medicamento) throw new NotFoundException(`Medicamento ${id} no encontrado`);
    await this.repo.save(medicamento);
    return this.findOne(id);
  }

  async remove(id: number) {
    const medicamento = await this.findOne(id);
    await this.repo.remove(medicamento);
    return { mensaje: 'Medicamento eliminado' };
  }
}