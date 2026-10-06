import { useEffect, useState } from 'react';
import { api, mensajeError } from '../api/client.js';

const formVacio = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  laboratorio: '',
  fechaVencimiento: '',
  categoriaId: '',
};

const STOCK_MINIMO = 10;

// Cuántos días faltan para que venza (negativo = ya venció)
function diasParaVencer(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vence = new Date(fecha + 'T00:00:00');
  return Math.round((vence - hoy) / (1000 * 60 * 60 * 24));
}

function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

function formatearPrecio(precio) {
  return precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

export default function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const [meds, cats] = await Promise.all([
        api.get('/medicamentos'),
        api.get('/categorias'),
      ]);
      setMedicamentos(meds.data);
      setCategorias(cats.data);
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async () => {
    const datos = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoriaId: Number(form.categoriaId),
    };
    try {
      if (editandoId) {
        await api.patch(`/medicamentos/${editandoId}`, datos);
      } else {
        await api.post('/medicamentos', datos);
      }
      cancelar();
      cargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  const editar = (m) => {
    setForm({
      nombre: m.nombre,
      descripcion: m.descripcion ?? '',
      precio: m.precio,
      stock: m.stock,
      laboratorio: m.laboratorio,
      fechaVencimiento: m.fechaVencimiento,
      categoriaId: m.categoriaId,
    });
    setEditandoId(m.id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelar = () => {
    setForm(formVacio);
    setEditandoId(null);
    setError('');
  };

  const eliminar = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este medicamento?')) return;
    try {
      await api.delete(`/medicamentos/${id}`);
      cargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  const texto = busqueda.toLowerCase();
  const filtrados = medicamentos.filter(
    (m) =>
      m.nombre.toLowerCase().includes(texto) ||
      m.laboratorio.toLowerCase().includes(texto),
  );

  return (
    <section>
      <h1>Medicamentos</h1>

      <div className="tarjeta formulario">
        <h2>{editandoId ? 'Editar medicamento' : 'Nuevo medicamento'}</h2>
        <div className="grilla">
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar} />
          <input name="laboratorio" placeholder="Laboratorio" value={form.laboratorio} onChange={cambiar} />
          <input name="precio" type="number" step="0.01" min="0" placeholder="Precio" value={form.precio} onChange={cambiar} />
          <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={cambiar} />
          <label>
            Fecha de vencimiento
            <input name="fechaVencimiento" type="date" value={form.fechaVencimiento} onChange={cambiar} />
          </label>
          <label>
            Categoría
            <select name="categoriaId" value={form.categoriaId} onChange={cambiar}>
              <option value="">Elegí una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </label>
        </div>
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={cambiar} />
        <div className="acciones">
          <button onClick={guardar}>{editandoId ? 'Actualizar' : 'Crear'}</button>
          {editandoId && <button className="secundario" onClick={cancelar}>Cancelar</button>}
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="tarjeta">
        <input
          className="buscador"
          placeholder="🔍 Buscar por nombre o laboratorio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Categoría</th><th>Laboratorio</th>
              <th>Precio</th><th>Stock</th><th>Vencimiento</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m) => {
              const dias = diasParaVencer(m.fechaVencimiento);
              return (
                <tr key={m.id}>
                  <td>
                    <strong>{m.nombre}</strong>
                    <div className="detalle">{m.descripcion}</div>
                  </td>
                  <td>{m.categoria?.nombre}</td>
                  <td>{m.laboratorio}</td>
                  <td>{formatearPrecio(m.precio)}</td>
                  <td>
                    {m.stock}{' '}
                    {m.stock < STOCK_MINIMO && <span className="etiqueta naranja">Stock bajo</span>}
                  </td>
                  <td>
                    {formatearFecha(m.fechaVencimiento)}{' '}
                    {dias < 0 && <span className="etiqueta roja">Vencido</span>}
                    {dias >= 0 && dias <= 30 && <span className="etiqueta amarilla">Vence en {dias} días</span>}
                  </td>
                  <td className="acciones">
                    <button className="secundario" onClick={() => editar(m)}>Editar</button>
                    <button className="peligro" onClick={() => eliminar(m.id)}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtrados.length === 0 && <p className="detalle">No se encontraron medicamentos.</p>}
      </div>
    </section>
  );
}