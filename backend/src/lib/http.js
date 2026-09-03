'use strict';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

function ok(dados, status = 200) {
  return { status, headers: JSON_HEADERS, jsonBody: dados };
}

function erro(status, mensagem, detalhes) {
  return {
    status,
    headers: JSON_HEADERS,
    jsonBody: { erro: mensagem, ...(detalhes ? { detalhes } : {}) },
  };
}

/**
 * Envolve o handler para que qualquer excecao vire uma resposta JSON
 * previsivel em vez de um 500 vazio do runtime.
 */
function comTratamentoDeErro(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (e) {
      context.error(`Falha em ${request.method} ${request.url}:`, e);
      const status = Number.isInteger(e.status) ? e.status : 500;
      return erro(status, e.message || 'Erro interno no servidor', e.detalhes);
    }
  };
}

module.exports = { ok, erro, comTratamentoDeErro };
