'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Carrega o backend/.env em process.env quando rodando localmente.
 * No Azure a mesma chave vem das Application Settings, entao nada e sobrescrito.
 */
function carregarEnvLocal() {
  const arquivo = path.join(__dirname, '..', '..', '.env');
  if (!fs.existsSync(arquivo)) return;

  for (const linha of fs.readFileSync(arquivo, 'utf8').split(/\r?\n/)) {
    const texto = linha.trim();
    if (!texto || texto.startsWith('#')) continue;

    const separador = texto.indexOf('=');
    if (separador === -1) continue;

    const chave = texto.slice(0, separador).trim();
    let valor = texto.slice(separador + 1).trim();
    if (/^(".*"|'.*')$/s.test(valor)) valor = valor.slice(1, -1);

    if (process.env[chave] === undefined) process.env[chave] = valor;
  }
}

carregarEnvLocal();

const config = {
  // Mock externo (Apidog). Opcional: sem ele a API usa o mock local embutido.
  mockUrl: process.env.mock_api_url || '',
};

module.exports = { config };
