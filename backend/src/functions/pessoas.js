'use strict';

const { app } = require('@azure/functions');
const { listarPessoas, buscarPessoaPorId, criarPessoa } = require('../lib/mock');
const { ok, erro, comTratamentoDeErro } = require('../lib/http');

/**
 * GET /api/pessoas          -> lista todas as pessoas (dados mock)
 * GET /api/pessoas?nome=ana -> filtra por parte do nome
 *
 * Este e o endpoint GET com dados mock exigido pelo PJBL.
 */
app.http('pessoas-listar', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'pessoas',
  handler: comTratamentoDeErro(async (request, context) => {
    const nome = (request.query.get('nome') || '').trim();
    const { origem, pessoas } = await listarPessoas({ nome }, context);

    context.log(`Listagem de pessoas (filtro="${nome}"): ${pessoas.length} registro(s).`);
    return ok({ origem, filtro: nome || null, total: pessoas.length, pessoas });
  }),
});

/** GET /api/pessoas/{id} -> busca uma pessoa especifica */
app.http('pessoas-buscar-por-id', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'pessoas/{id}',
  handler: comTratamentoDeErro(async (request, context) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id)) return erro(400, 'O id informado precisa ser um numero inteiro.');

    const { origem, pessoa } = await buscarPessoaPorId(id, context);
    if (!pessoa) return erro(404, `Nenhuma pessoa encontrada com o id ${id}.`);

    return ok({ origem, pessoa });
  }),
});

/**
 * POST /api/pessoas { "nome": "..." } -> cadastra uma pessoa
 *
 * Sem banco de dados, o registro fica na memoria da instancia da Function:
 * some quando ela reinicia. E o comportamento esperado de um mock backend.
 */
app.http('pessoas-criar', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'pessoas',
  handler: comTratamentoDeErro(async (request, context) => {
    let corpo;
    try {
      corpo = await request.json();
    } catch {
      return erro(400, 'Envie um corpo JSON valido.');
    }

    const nome = String(corpo?.nome ?? '').trim();
    if (!nome) return erro(400, 'O campo "nome" e obrigatorio.');
    if (nome.length > 120) return erro(400, 'O campo "nome" deve ter no maximo 120 caracteres.');

    const pessoa = await criarPessoa(nome, context);
    context.log(`Pessoa cadastrada: ${JSON.stringify(pessoa)}`);

    return ok(
      {
        mensagem: 'Pessoa cadastrada com sucesso.',
        aviso: 'Mock backend: o registro nao e persistido e some quando a Function reinicia.',
        pessoa,
      },
      201
    );
  }),
});
