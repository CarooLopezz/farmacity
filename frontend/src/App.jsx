import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Categorias from './pages/Categorias.jsx';
import Medicamentos from './pages/Medicamentos.jsx';
import Empleados from './pages/Empleados.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <header className="navbar">
        <span className="logo">💊 Farmacity</span>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/medicamentos">Medicamentos</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
          <NavLink to="/empleados">Empleados</NavLink>
        </nav>
      </header>

      <main className="contenido">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/medicamentos" element={<Medicamentos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/empleados" element={<Empleados />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}