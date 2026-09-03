import { useCallback, useEffect, useState } from 'react';
import { listarPessoas } from '../api.js';
import Aviso from '../components/Aviso.jsx';
import TabelaPessoas from '../components/TabelaPessoas.jsx';

/**
 * Tela 1 — todas as pessoas.
 * Consome o endpoint GET /api/pessoas das Azure Functions (dados mock).
 */
export default function Lista() {
  const [pessoas, setPessoas] = useState([]);
  const [origem, setOrigem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const dados = await listarPessoas();
      setPessoas(dados.pessoas || []);
      setOrigem(dados.origem || null);
    } catch (e) {
      setPessoas([]);
      setOrigem(null);
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <section className="cartao">
      <div className="cartao__topo">
        <div>
          <h2>Todas as pessoas</h2>
          <p className="cartao__descricao">
            Lista completa retornada pelo endpoint <code>GET /api/pessoas</code> das Azure Functions.
          </p>
        </div>
        <button
          type="button"
          className="botao botao--secundario"
          onClick={carregar}
          disabled={carregando}
        >
          Atualizar
        </button>
      </div>

      <Aviso tipo="erro">{erro}</Aviso>

      {!erro && !carregando && (
        <p className="resumo">
          {pessoas.length} {pessoas.length === 1 ? 'pessoa' : 'pessoas'}
          {origem ? ` · fonte: ${origem}` : ''}
        </p>
      )}

      <TabelaPessoas pessoas={pessoas} carregando={carregando} />
    </section>
  );
}
