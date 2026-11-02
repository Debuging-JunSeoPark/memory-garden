import { timingSafeEqual } from 'node:crypto';
import { createServer as createNodeServer } from 'node:http';

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'cache-control': 'no-store',
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body));
}

function authorized(header, token) {
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return false;
  const provided = Buffer.from(header.slice(7));
  const expected = Buffer.from(token);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

async function readJson(request, limit) {
  const declaredLength = Number(request.headers['content-length'] ?? 0);
  if (declaredLength > limit) {
    request.resume();
    const error = new Error('Body too large');
    error.code = 'BODY_TOO_LARGE';
    throw error;
  }

  return await new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;
    let settled = false;
    request.on('data', (chunk) => {
      if (settled) return;
      bytes += chunk.length;
      if (bytes > limit) {
        settled = true;
        const error = new Error('Body too large');
        error.code = 'BODY_TOO_LARGE';
        reject(error);
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      if (settled) return;
      settled = true;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        const error = new Error('Invalid JSON');
        error.code = 'INVALID_JSON';
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

export function createServer(config) {
  const { token, bodyLimitBytes = 65_536, registry } = config;
  if (!token) throw new Error('Server agent token is required');
  if (!registry) throw new Error('Server agent registry is required');

  return createNodeServer(async (request, response) => {
    if (!authorized(request.headers.authorization, token)) {
      sendJson(response, 401, { error: 'UNAUTHORIZED' });
      return;
    }

    const url = new URL(request.url ?? '/', 'http://localhost');
    if (request.method === 'POST' && url.pathname === '/v1/jobs') {
      let body;
      try {
        body = await readJson(request, bodyLimitBytes);
      } catch (error) {
        const status = error.code === 'BODY_TOO_LARGE' ? 413 : 400;
        sendJson(response, status, { error: error.code ?? 'INVALID_REQUEST' });
        return;
      }

      if (!body || typeof body !== 'object' || typeof body.type !== 'string') {
        sendJson(response, 400, { error: 'INVALID_REQUEST' });
        return;
      }
      if (!registry.hasType(body.type)) {
        sendJson(response, 422, { error: 'UNKNOWN_JOB_TYPE' });
        return;
      }

      const idempotencyKey = request.headers['idempotency-key'];
      if (idempotencyKey !== undefined && typeof idempotencyKey !== 'string') {
        sendJson(response, 400, { error: 'INVALID_IDEMPOTENCY_KEY' });
        return;
      }
      const job = registry.enqueue({ type: body.type, input: body.input, idempotencyKey });
      sendJson(response, 202, { jobId: job.jobId, status: 'queued' });
      return;
    }

    const jobMatch = url.pathname.match(/^\/v1\/jobs\/([0-9a-f-]+)$/i);
    if (request.method === 'GET' && jobMatch) {
      const job = registry.get(jobMatch[1]);
      if (!job) {
        sendJson(response, 404, { error: 'JOB_NOT_FOUND' });
        return;
      }
      sendJson(response, 200, job);
      return;
    }

    sendJson(response, 404, { error: 'NOT_FOUND' });
  });
}

