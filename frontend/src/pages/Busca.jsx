import { useState } from 'react';
import { buscarPessoaPorId, listarPessoas } from '../api.js';
import Aviso from '../components/Aviso.jsx';
import TabelaPessoas from '../components/TabelaPessoas.jsx';

/**
 * Tela 2 — busca de uma pessoa especifica.
 * Por ID usa GET /api/pessoas/{id}; por nome usa GET /api/pessoas?nome=.
 */
export default function Busca() {
  const [modo, setModo] = useState('nome');
  const [termo, setTermo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function pesquisar(evento) {
    evento.preventDefault();

    const valor = termo.trim();
    if (!valor) {
      setErro(modo === 'id' ? 'Informe o ID da pessoa.' : 'Informe um nome para pesquisar.');
      setResultado(null);
      return;
    }
    if (modo === 'id' && !/^\d+$/.test(valor)) {
      setErro('O ID deve conter apenas numeros.');
      setResultado(null);
      return;
    }

    setCarregando(true);
    setErro('');
    setResultado(null);
    try {
      const dados =
        modo === 'id'
          ? { pessoas: [(await buscarPessoaPorId(valor)).pessoa] }
          : await listarPessoas({ nome: valor });
      setResultado(dados.pessoas || []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  function trocarModo(novoModo) {
    setModo(novoModo);
    setTermo('');
    setResultado(null);
    setErro('');
  }

  return (
    <section className="cartao">
      <div className="cartao__topo">
        <div>
          <h2>Buscar pessoa</h2>
          <p className="cartao__descricao">Pesquise um registro especifico pelo ID ou pelo nome.</p>
        </div>
      </div>

      <div className="seletor-fonte" role="group" aria-label="Modo de busca">
        <button
          type="button"
          className={`seletor-fonte__item${modo === 'nome' ? ' seletor-fonte__item--ativo' : ''}`}
          onClick={() => trocarModo('nome')}
          aria-pressed={modo === 'nome'}
        >
          Por nome
        </button>
        <button
          type="button"
          className={`seletor-fonte__item${modo === 'id' ? ' seletor-fonte__item--ativo' : ''}`}
          onClick={() => trocarModo('id')}
          aria-pressed={modo === 'id'}
        >
          Por ID
        </button>
      </div>

      <form className="formulario formulario--linha" onSubmit={pesquisar}>
        <label className="campo">
          <span className="campo__rotulo">{modo === 'id' ? 'ID da pessoa' : 'Nome ou parte do nome'}</span>
          <input
            className="campo__entrada"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder={modo === 'id' ? 'Ex.: 3' : 'Ex.: Amanda'}
            inputMode={modo === 'id' ? 'numeric' : 'text'}
            autoComplete="off"
          />
        </label>
        <button type="submit" className="botao" disabled={carregando}>
          {carregando ? 'Buscando…' : 'Buscar'}
        </button>
      </form>

      <Aviso tipo="erro">{erro}</Aviso>

      {resultado !== null && (
        <>
          <p className="resumo">
            {resultado.length} {resultado.length === 1 ? 'resultado' : 'resultados'} para “{termo.trim()}”
          </p>
          <TabelaPessoas
            pessoas={resultado}
            carregando={false}
            mensagemVazio="Nenhuma pessoa corresponde a essa busca."
          />
        </>
      )}
    </section>
  );
}
