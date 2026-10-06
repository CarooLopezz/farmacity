import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './entities/empleado.entity.js';
import { CreateEmpleadoDto } from './dto/create-empleado.dto.js';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto.js';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly repo: Repository<Empleado>,
  ) {}

  private async verificarUnicos(dto: { dni?: string; email?: string }, idActual?: number) {
    if (dto.dni) {
      const existe = await this.repo.findOne({ where: { dni: dto.dni } });
      if (existe && existe.id !== idActual) {
        throw new ConflictException('Ya existe un empleado con ese DNI');
      }
    }
    if (dto.email) {
      const existe = await this.repo.findOne({ where: { email: dto.email } });
      if (existe && existe.id !== idActual) {
        throw new ConflictException('Ya existe un empleado con ese email');
      }
    }
  }

  async create(dto: CreateEmpleadoDto) {
    await this.verificarUnicos(dto);
    const empleado = this.repo.create(dto);
    return this.repo.save(empleado);
  }

  findAll() {
    return this.repo.find({ order: { apellido: 'ASC', nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const empleado = await this.repo.findOne({ where: { id } });
    if (!empleado) throw new NotFoundException(`Empleado ${id} no encontrado`);
    return empleado;
  }

  async update(id: number, dto: UpdateEmpleadoDto) {
    await this.verificarUnicos(dto, id);
    const empleado = await this.repo.preload({ id, ...dto });
    if (!empleado) throw new NotFoundException(`Empleado ${id} no encontrado`);
    return this.repo.save(empleado);
  }

  async remove(id: number) {
    const empleado = await this.findOne(id);
    await this.repo.remove(empleado);
    return { mensaje: 'Empleado eliminado' };
  }
}