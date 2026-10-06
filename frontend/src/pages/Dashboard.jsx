import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mensajeError } from '../api/client.js';

const STOCK_MINIMO = 10;

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

export default function Dashboard() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/medicamentos'), api.get('/categorias'), api.get('/empleados')])
      .then(([meds, cats, emps]) => {
        setMedicamentos(meds.data);
        setCategorias(cats.data);
        setEmpleados(emps.data);
      })
      .catch((e) => setError(mensajeError(e)));
  }, []);

  // Cálculos para las tarjetas y alertas
  const valorInventario = medicamentos.reduce((total, m) => total + m.precio * m.stock, 0);
  const stockBajo = medicamentos.filter((m) => m.stock < STOCK_MINIMO);
  const vencidos = medicamentos.filter((m) => diasParaVencer(m.fechaVencimiento) < 0);
  const porVencer = medicamentos.filter((m) => {
    const dias = diasParaVencer(m.fechaVencimiento);
    return dias >= 0 && dias <= 30;
  });

  // Datos para el gráfico: cantidad de medicamentos por categoría
  const porCategoria = categorias.map((c) => ({
    nombre: c.nombre,
    cantidad: medicamentos.filter((m) => m.categoriaId === c.id).length,
  }));
  const maximo = Math.max(1, ...porCategoria.map((c) => c.cantidad));

  return (
    <section>
      <h1>Dashboard</h1>
      {error && <p className="error">{error}</p>}

      <div className="resumen">
        <Link to="/medicamentos" className="tarjeta dato">
          <span className="numero">{medicamentos.length}</span>
          <span>Medicamentos</span>
        </Link>
        <Link to="/categorias" className="tarjeta dato">
          <span className="numero">{categorias.length}</span>
          <span>Categorías</span>
        </Link>
        <Link to="/empleados" className="tarjeta dato">
          <span className="numero">{empleados.length}</span>
          <span>Empleados</span>
        </Link>
        <div className="tarjeta dato">
          <span className="numero">
            {valorInventario.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
          </span>
          <span>Valor del inventario</span>
        </div>
      </div>

      <div className="tarjeta">
        <h2>📊 Medicamentos por categoría</h2>
        <div className="grafico">
          {porCategoria.map((c) => (
            <div key={c.nombre} className="fila-grafico">
              <span className="nombre-barra">{c.nombre}</span>
              <div className="pista">
                <div className="barra" style={{ width: `${(c.cantidad / maximo) * 100}%` }} />
              </div>
              <span className="valor-barra">{c.cantidad}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="alertas">
        <div className="tarjeta">
          <h2>⚠️ Stock bajo ({stockBajo.length})</h2>
          {stockBajo.length === 0 && <p className="detalle">Todo el stock está en orden.</p>}
          <ul className="lista">
            {stockBajo.map((m) => (
              <li key={m.id}>
                {m.nombre} <span className="etiqueta naranja">{m.stock} u.</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="tarjeta">
          <h2>⏰ Vencimientos ({vencidos.length + porVencer.length})</h2>
          {vencidos.length + porVencer.length === 0 && (
            <p className="detalle">No hay medicamentos vencidos ni por vencer.</p>
          )}
          <ul className="lista">
            {vencidos.map((m) => (
              <li key={m.id}>
                {m.nombre} <span className="etiqueta roja">Vencido el {formatearFecha(m.fechaVencimiento)}</span>
              </li>
            ))}
            {porVencer.map((m) => (
              <li key={m.id}>
                {m.nombre}{' '}
                <span className="etiqueta amarilla">Vence en {diasParaVencer(m.fechaVencimiento)} días</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}