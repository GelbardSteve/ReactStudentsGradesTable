const express = require('express');
const { BuiltInAgent, CopilotRuntime } = require('@copilotkit/runtime/v2');
const { createCopilotExpressHandler } = require('@copilotkit/runtime/v2/express');
const { findAdminIdByToken, parseBearer } = require('../middleware/requireAdmin');
const { SYSTEM_PROMPT, createGuardrailsMiddleware } = require('./guardrails');
const { buildTools } = require('./tools');

const BASE_PATH = '/api/copilotkit';

// Mounts the AI assistant at /api/copilotkit:
// requireAdmin -> guardrails (rate limit, input checks) -> CopilotKit runtime -> Gemini with admin-scoped tools.
// Must be called before the app-wide express.json(), so long conversations get a larger body limit.
module.exports = (app, mysqlConnection, requireAdmin) => {
  // GOOGLE_API_KEY is the name CopilotKit reads by default; GEMINI_API_KEY is what this project uses
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set; the AI assistant is disabled. See .env.example.');
    // A clear answer instead of a bare 404, so the chat's error says what is missing
    app.use(BASE_PATH, (req, res) =>
      res.status(503).json({ error: 'The AI assistant is disabled: GEMINI_API_KEY is not set on the server.' })
    );
    return;
  }

  const db = mysqlConnection.promise();

  // requireAdmin already checked the token; this lookup is what the runtime and tools trust
  const adminFromRequest = async (request) => {
    const token = parseBearer(request.headers.get('authorization'));
    const adminId = token && (await findAdminIdByToken(mysqlConnection, token));
    if (!adminId) throw new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    return adminId;
  };

  const runtime = new CopilotRuntime({
    // Chat threads belong to the admin who created them
    identifyUser: async (request) => {
      const adminId = String(await adminFromRequest(request));
      return { id: adminId, name: `admin-${adminId}` };
    },
    // A fresh agent per request, so its tools are bound to the admin who sent it
    agents: async ({ request }) => {
      const adminId = await adminFromRequest(request);

      return {
        default: new BuiltInAgent({
          // flash-lite has the most generous free-tier quota
          model: process.env.AI_MODEL || 'google:gemini-3.5-flash-lite',
          apiKey,
          prompt: SYSTEM_PROMPT,
          tools: buildTools(db, adminId),
          maxSteps: 5,
          // Each retry spends free-tier quota, and a quota error won't clear on retry anyway
          maxRetries: 1,
          temperature: 0.2,
        }),
      };
    },
  });

  app.use(
    BASE_PATH,
    express.json({ limit: '1mb' }),
    requireAdmin,
    createGuardrailsMiddleware({ limit: Number(process.env.AI_RATE_LIMIT_PER_MIN) || 20 })
  );
  app.use(createCopilotExpressHandler({ runtime, basePath: BASE_PATH }));

  console.log(`AI assistant mounted at ${BASE_PATH}`);
};
