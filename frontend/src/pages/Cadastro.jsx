import { useState } from 'react';
import { cadastrarPessoa } from '../api.js';
import Aviso from '../components/Aviso.jsx';

/** Tela 3 — cadastro de pessoas via POST /api/pessoas. */
export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  async function enviar(evento) {
    evento.preventDefault();

    const valor = nome.trim();
    if (!valor) {
      setErro('Digite o nome da pessoa.');
      setSucesso('');
      return;
    }

    setEnviando(true);
    setErro('');
    setSucesso('');
    try {
      const dados = await cadastrarPessoa(valor);
      setSucesso(
        `Pessoa "${dados.pessoa?.nome ?? valor}" cadastrada com o ID ${dados.pessoa?.id ?? '—'}.`
      );
      setNome('');
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="cartao">
      <div className="cartao__topo">
        <div>
          <h2>Cadastrar pessoa</h2>
          <p className="cartao__descricao">
            O registro e enviado por <code>POST /api/pessoas</code> para a Azure Function.
          </p>
        </div>
      </div>

      <Aviso tipo="info">
        Mock backend: os cadastros ficam na memoria da Azure Function e sao perdidos quando ela
        reinicia. Nao ha banco de dados neste projeto.
      </Aviso>

      <form className="formulario" onSubmit={enviar}>
        <label className="campo">
          <span className="campo__rotulo">Nome</span>
          <input
            className="campo__entrada"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Amanda Fila de Lima"
            maxLength={120}
            autoComplete="off"
          />
        </label>

        <button type="submit" className="botao" disabled={enviando}>
          {enviando ? 'Cadastrando…' : 'Cadastrar'}
        </button>
      </form>

      <Aviso tipo="erro">{erro}</Aviso>
      <Aviso tipo="sucesso">{sucesso}</Aviso>
    </section>
  );
}
