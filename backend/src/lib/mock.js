'use strict';

const { config } = require('./config');

/**
 * Mock backend do projeto: a "base" de pessoas vive aqui, na propria Azure Function.
 * Cada registro tem apenas id e nome.
 *
 * Se `mock_api_url` estiver configurado, a lista base vem do Cloud Mock do Apidog;
 * caso contrario usa a lista local abaixo.
 */
const PESSOAS_BASE = [
  { id: 1, nome: 'Amanda Fila de Lima' },
  { id: 2, nome: 'Carlos Leonardo Garcia Pscheidt' },
  { id: 3, nome: 'Gustavo Yuri' },
  { id: 4, nome: 'Rafael Della' },
  { id: 5, nome: 'Ana Beatriz Moraes' },
  { id: 6, nome: 'Bruno Tadeu Ferreira' },
  { id: 7, nome: 'Camila Rocha Antunes' },
  { id: 8, nome: 'Diego Nascimento Alves' },
  { id: 9, nome: 'Eduarda Nunes Prado' },
  { id: 10, nome: 'Felipe Andrade Correia' },
];

/**
 * Cadastros feitos em runtime. Como nao existe banco, eles vivem apenas na
 * memoria da instancia da Function e somem quando ela reinicia — comportamento
 * esperado de um mock backend.
 */
const cadastradas = [];

/** Le a lista base: Apidog quando configurado, senao o mock local. */
async function obterBase(context) {
  if (!config.mockUrl) return { origem: 'mock-local', pessoas: PESSOAS_BASE };

  try {
    const resposta = await fetch(config.mockUrl, { headers: { Accept: 'application/json' } });
    if (!resposta.ok) throw new Error(`mock externo respondeu ${resposta.status}`);

    const corpo = await resposta.json();
    const pessoas = Array.isArray(corpo) ? corpo : corpo.pessoas || corpo.data || [];
    return { origem: 'apidog', pessoas };
  } catch (e) {
    context?.warn(`Mock externo indisponivel (${e.message}); usando mock local.`);
    return { origem: 'mock-local', pessoas: PESSOAS_BASE };
  }
}

/** Lista todas as pessoas, opcionalmente filtrando por parte do nome. */
async function listarPessoas({ nome } = {}, context) {
  const { origem, pessoas } = await obterBase(context);
  const todas = [...pessoas, ...cadastradas];

  const termo = (nome || '').trim().toLowerCase();
  const filtradas = termo
    ? todas.filter((p) => String(p.nome || '').toLowerCase().includes(termo))
    : todas;

  return { origem, pessoas: filtradas };
}

/** Busca uma pessoa pelo id. Retorna null quando nao existe. */
async function buscarPessoaPorId(id, context) {
  const { origem, pessoas } = await listarPessoas({}, context);
  return { origem, pessoa: pessoas.find((p) => Number(p.id) === Number(id)) || null };
}

/** Cadastra uma pessoa na memoria da Function e devolve o registro criado. */
async function criarPessoa(nome, context) {
  const { pessoas } = await listarPessoas({}, context);
  const proximoId = pessoas.reduce((maior, p) => Math.max(maior, Number(p.id) || 0), 0) + 1;

  const pessoa = { id: proximoId, nome };
  cadastradas.push(pessoa);
  return pessoa;
}

module.exports = { PESSOAS_BASE, listarPessoas, buscarPessoaPorId, criarPessoa };
