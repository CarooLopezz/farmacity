import { Type } from 'class-transformer';
import {
  IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber,
  IsPositive, IsInt, Min, IsDateString,
} from 'class-validator';

export class CreateMedicamentoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  precio: number;

  @Type(() => Number)
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsString()
  @IsNotEmpty({ message: 'El laboratorio es obligatorio' })
  @MaxLength(100)
  laboratorio: string;

  @IsDateString({}, { message: 'La fecha de vencimiento debe tener formato AAAA-MM-DD' })
  fechaVencimiento: string;

  @Type(() => Number)
  @IsInt({ message: 'Debe indicar una categoría válida' })
  categoriaId: number;
}