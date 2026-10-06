import { useEffect, useState } from 'react';
import { api, mensajeError } from '../api/client.js';

const formVacio = { nombre: '', descripcion: '' };

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      const { data } = await api.get('/categorias');
      setCategorias(data);
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
        await api.patch(`/categorias/${editandoId}`, form);
      } else {
        await api.post('/categorias', form);
      }
      cancelar();
      cargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  const editar = (categoria) => {
    setForm({ nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' });
    setEditandoId(categoria.id);
    setError('');
  };

  const cancelar = () => {
    setForm(formVacio);
    setEditandoId(null);
    setError('');
  };

  const eliminar = async (id) => {
    if (!confirm('¿Seguro que querés eliminar esta categoría?')) return;
    try {
      await api.delete(`/categorias/${id}`);
      cargar();
    } catch (e) {
      setError(mensajeError(e));
    }
  };

  return (
    <section>
      <h1>Categorías</h1>

      <div className="tarjeta formulario">
        <h2>{editandoId ? 'Editar categoría' : 'Nueva categoría'}</h2>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar} />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={cambiar} />
        <div className="acciones">
          <button onClick={guardar}>{editandoId ? 'Actualizar' : 'Crear'}</button>
          {editandoId && <button className="secundario" onClick={cancelar}>Cancelar</button>}
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="tarjeta">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Descripción</th><th></th></tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.descripcion}</td>
                <td className="acciones">
                  <button className="secundario" onClick={() => editar(c)}>Editar</button>
                  <button className="peligro" onClick={() => eliminar(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}