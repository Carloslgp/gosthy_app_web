/**
 * Cliente HTTP das Azure Functions.
 *
 * Publicado no Azure Static Web Apps a API vive no mesmo dominio (/api).
 * Em desenvolvimento o Vite faz proxy de /api para o Functions Core Tools (7071).
 * VITE_API_BASE permite apontar para uma Function App separada, se preciso.
 */
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

async function requisitar(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${BASE}${caminho}`, {
      headers: {
        Accept: 'application/json',
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...opcoes,
    });
  } catch {
    throw new Error('Nao foi possivel falar com a API. Verifique se o backend esta no ar.');
  }

  const texto = await resposta.text();
  let corpo = null;
  if (texto) {
    try {
      corpo = JSON.parse(texto);
    } catch {
      corpo = null;
    }
  }

  if (!resposta.ok) {
    const detalhe = corpo?.detalhes ? ` (${corpo.detalhes})` : '';
    throw new Error((corpo?.erro || `A API respondeu ${resposta.status}.`) + detalhe);
  }

  return corpo;
}

/** Lista as pessoas, com filtro opcional por nome. */
export function listarPessoas({ nome = '' } = {}) {
  const query = nome.trim() ? `?nome=${encodeURIComponent(nome.trim())}` : '';
  return requisitar(`/api/pessoas${query}`);
}

/** Busca uma pessoa especifica pelo id. */
export function buscarPessoaPorId(id) {
  return requisitar(`/api/pessoas/${encodeURIComponent(id)}`);
}

/** Cadastra uma nova pessoa. */
export function cadastrarPessoa(nome) {
  return requisitar('/api/pessoas', { method: 'POST', body: JSON.stringify({ nome }) });
}

/** Diagnostico da API. */
export function verificarSaude() {
  return requisitar('/api/health');
}
