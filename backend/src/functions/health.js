'use strict';

const { app } = require('@azure/functions');
const { config } = require('../lib/config');
const { ok } = require('../lib/http');

/** GET /api/health -> diagnostico rapido do deploy. */
app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: async () =>
    ok({
      status: 'ok',
      horario: new Date().toISOString(),
      fonteDeDados: config.mockUrl ? 'apidog' : 'mock-local',
    }),
});
