import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Cadastrar from '../Pages/Cadastrar';
import Dashboard from '../Pages/Dashboard';
import Movimentos from '../Pages/Movimentos';
import Categorias from '../Pages/Categorias';
import GruposCategorias from '../Pages/GruposCategorias';
import Contas from '../Pages/Contas';
import Cartoes from '../Pages/Cartoes';
import Faturas from '../Pages/Faturas';
import DetalhesFatura from '../Pages/DetalhesFatura';
import DRE from '../Pages/DRE';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movimentos" element={<Movimentos />} />
        <Route path="/contas" element={<Contas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/grupos-categorias" element={<GruposCategorias />} />
        <Route path="/cartoes" element={<Cartoes />} />
        <Route path="/faturas" element={<Faturas />} />
        <Route path="/faturas/:id" element={<DetalhesFatura />} />
        <Route path="/dre" element={<DRE />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
