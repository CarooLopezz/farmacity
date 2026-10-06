import { IsString, IsNotEmpty, IsEmail, Matches, IsDateString, MaxLength } from 'class-validator';

export class CreateEmpleadoDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(80)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(80)
  apellido: string;

  @Matches(/^\d{7,8}$/, { message: 'El DNI debe tener 7 u 8 dígitos, sin puntos' })
  dni: string;

  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @Matches(/^[0-9+\-\s]{6,20}$/, { message: 'El teléfono solo puede tener números, espacios, + o -' })
  telefono: string;

  @IsString()
  @IsNotEmpty({ message: 'El cargo es obligatorio' })
  @MaxLength(60)
  cargo: string;

  @IsDateString({}, { message: 'La fecha de ingreso debe tener formato AAAA-MM-DD' })
  fechaIngreso: string;
}
