import { useEffect, useState } from 'react';
import { api, mensajeError } from '../api/client.js';

const formVacio = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  cargo: '',
  fechaIngreso: '',
};

function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const { data } = await api.get('/empleados');
      setEmpleados(data);
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async () => {
    try {
      if (editandoId) {
        await api.patch(`/empleados/${editandoId}`, form);
      } else {
        await api.post('/empleados', form);
      }
      cancelar();
      cargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  const editar = (emp) => {
    setForm({
      nombre: emp.nombre,
      apellido: emp.apellido,
      dni: emp.dni,
      email: emp.email,
      telefono: emp.telefono,
      cargo: emp.cargo,
      fechaIngreso: emp.fechaIngreso,
    });
    setEditandoId(emp.id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelar = () => {
    setForm(formVacio);
    setEditandoId(null);
    setError('');
  };

  const eliminar = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este empleado?')) return;
    try {
      await api.delete(`/empleados/${id}`);
      cargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  const texto = busqueda.toLowerCase();
  const filtrados = empleados.filter(
    (emp) =>
      `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(texto) ||
      emp.dni.includes(texto),
  );

  return (
    <section>
      <h1>Empleados</h1>

      <div className="tarjeta formulario">
        <h2>{editandoId ? 'Editar empleado' : 'Nuevo empleado'}</h2>
        <div className="grilla">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar} />
          <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={cambiar} />
          <input name="dni" placeholder="DNI (sin puntos)" value={form.dni} onChange={cambiar} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={cambiar} />
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={cambiar} />
          <input name="cargo" placeholder="Cargo" list="cargos" value={form.cargo} onChange={cambiar} />
          <datalist id="cargos">
            <option value="Farmacéutico/a" />
            <option value="Cajero/a" />
            <option value="Repositor/a" />
            <option value="Administrativo/a" />
            <option value="Encargado/a" />
          </datalist>
          <label>
            Fecha de ingreso
            <input name="fechaIngreso" type="date" value={form.fechaIngreso} onChange={cambiar} />
          </label>
        </div>
        <div className="acciones">
          <button onClick={guardar}>{editandoId ? 'Actualizar' : 'Crear'}</button>
          {editandoId && <button className="secundario" onClick={cancelar}>Cancelar</button>}
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="tarjeta">
        <input
          className="buscador"
          placeholder="🔍 Buscar por nombre, apellido o DNI..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Apellido y nombre</th><th>DNI</th><th>Email</th>
              <th>Teléfono</th><th>Cargo</th><th>Ingreso</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((emp) => (
              <tr key={emp.id}>
                <td><strong>{emp.apellido}, {emp.nombre}</strong></td>
                <td>{emp.dni}</td>
                <td>{emp.email}</td>
                <td>{emp.telefono}</td>
                <td>{emp.cargo}</td>
                <td>{formatearFecha(emp.fechaIngreso)}</td>
                <td className="acciones">
                  <button className="secundario" onClick={() => editar(emp)}>Editar</button>
                  <button className="peligro" onClick={() => eliminar(emp.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && <p className="detalle">No se encontraron empleados.</p>}
      </div>
    </section>
  );
}