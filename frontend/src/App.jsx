import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/Cadastro.jsx';
import Lista from './pages/Lista.jsx';
import Busca from './pages/Busca.jsx';

const TELAS = [
  { para: '/pessoas', rotulo: 'Todas as pessoas' },
  { para: '/buscar', rotulo: 'Buscar pessoa' },
  { para: '/cadastro', rotulo: 'Cadastrar' },
];

export default function App() {
  return (
    <div className="app">
      <header className="cabecalho">
        <div className="cabecalho__marca">
          <span className="cabecalho__logo" aria-hidden="true">
            👻
          </span>
          <div>
            <h1>Ghosty Web</h1>
            <p>Cadastro e consulta de pessoas</p>
          </div>
        </div>

        <nav className="navegacao" aria-label="Telas do sistema">
          {TELAS.map((tela) => (
            <NavLink
              key={tela.para}
              to={tela.para}
              className={({ isActive }) => `navegacao__item${isActive ? ' navegacao__item--ativo' : ''}`}
            >
              {tela.rotulo}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Navigate to="/pessoas" replace />} />
          <Route path="/pessoas" element={<Lista />} />
          <Route path="/buscar" element={<Busca />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="*" element={<Navigate to="/pessoas" replace />} />
        </Routes>
      </main>

      <footer className="rodape">
        PJBL Cloud · React + Azure Functions + Azure Static Web Apps
      </footer>
    </div>
  );
}
