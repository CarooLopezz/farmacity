import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repo: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto) {
    const existe = await this.repo.findOne({ where: { nombre: dto.nombre } });
    if (existe) throw new ConflictException('Ya existe una categoría con ese nombre');
    const categoria = this.repo.create(dto);
    return this.repo.save(categoria);
  }

  findAll() {
    return this.repo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const categoria = await this.repo.findOne({ where: { id } });
    if (!categoria) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const categoria = await this.repo.preload({ id, ...dto });
    if (!categoria) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return this.repo.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    try {
      await this.repo.remove(categoria);
    } catch {
      throw new ConflictException('No se puede eliminar: la categoría tiene medicamentos asociados');
    }
    return { mensaje: 'Categoría eliminada' };
  }
}
