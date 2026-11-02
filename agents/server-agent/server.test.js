import { once } from 'node:events';
import { afterEach, describe, expect, test } from 'vitest';

const servers = [];

async function loadAgent() {
  try {
    return await import('./src/index.js');
  } catch {
    return {};
  }
}

async function startServer(options = {}) {
  const { createJobRegistry, createServer } = await loadAgent();
  expect(typeof createJobRegistry).toBe('function');
  expect(typeof createServer).toBe('function');

  const registry = createJobRegistry({
    timeoutMs: options.timeoutMs ?? 100,
    executors: {
      echo: async (input) => input,
      hang: async () => await new Promise(() => {}),
    },
  });
  const server = createServer({
    host: '127.0.0.1',
    port: 0,
    token: 'test-token',
    bodyLimitBytes: 65_536,
    registry,
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  servers.push(server);
  const address = server.address();
  return { baseUrl: `http://127.0.0.1:${address.port}`, registry };
}

async function postJob(baseUrl, body, options = {}) {
  return await fetch(`${baseUrl}/v1/jobs`, {
    method: 'POST',
    headers: {
      authorization: options.authorization ?? 'Bearer test-token',
      'content-type': 'application/json',
      ...(options.idempotencyKey ? { 'idempotency-key': options.idempotencyKey } : {}),
    },
    body: options.rawBody ?? JSON.stringify(body),
  });
}

async function waitForStatus(registry, jobId, status) {
  const deadline = Date.now() + 1_000;
  while (Date.now() < deadline) {
    const job = registry.get(jobId);
    if (job?.status === status) return job;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  throw new Error(`Job ${jobId} did not reach ${status}`);
}

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        ),
    ),
  );
});

describe('server agent boundary', () => {
  test('defaults to localhost and requires an explicit token', async () => {
    const { loadConfig } = await loadAgent();
    expect(typeof loadConfig).toBe('function');

    expect(loadConfig({ SERVER_AGENT_TOKEN: 'configured' })).toMatchObject({
      host: '127.0.0.1',
      token: 'configured',
    });
    expect(() => loadConfig({})).toThrow('SERVER_AGENT_TOKEN is required');
  });

  test('rejects missing and incorrect bearer tokens', async () => {
    const { baseUrl } = await startServer();

    const missing = await postJob(baseUrl, { type: 'echo', input: {} }, { authorization: '' });
    const wrong = await postJob(
      baseUrl,
      { type: 'echo', input: {} },
      { authorization: 'Bearer wrong-token' },
    );

    expect(missing.status).toBe(401);
    expect(wrong.status).toBe(401);
  });

  test('rejects an unknown job type', async () => {
    const { baseUrl } = await startServer();

    const response = await postJob(baseUrl, { type: 'unknown', input: {} });

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({ error: 'UNKNOWN_JOB_TYPE' });
  });

  test('rejects malformed JSON', async () => {
    const { baseUrl } = await startServer();

    const response = await postJob(baseUrl, null, { rawBody: '{"type":' });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'INVALID_JSON' });
  });

  test('rejects request bodies larger than 64 KiB', async () => {
    const { baseUrl } = await startServer();

    const response = await postJob(baseUrl, {
      type: 'echo',
      input: { value: 'x'.repeat(66_000) },
    });

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({ error: 'BODY_TOO_LARGE' });
  });

  test('returns the same job for a duplicate idempotency key', async () => {
    const { baseUrl } = await startServer();

    const first = await postJob(
      baseUrl,
      { type: 'echo', input: { value: 1 } },
      { idempotencyKey: 'same-request' },
    );
    const second = await postJob(
      baseUrl,
      { type: 'echo', input: { value: 2 } },
      { idempotencyKey: 'same-request' },
    );
    const firstBody = await first.json();
    const secondBody = await second.json();

    expect(first.status).toBe(202);
    expect(second.status).toBe(202);
    expect(secondBody.jobId).toBe(firstBody.jobId);
  });

  test('marks work as failed when it exceeds the task timeout', async () => {
    const { baseUrl, registry } = await startServer({ timeoutMs: 30 });
    const response = await postJob(baseUrl, { type: 'hang', input: {} });
    const { jobId } = await response.json();

    const job = await waitForStatus(registry, jobId, 'failed');

    expect(job).toMatchObject({ status: 'failed', error: 'TIMEOUT' });
  });

  test('exposes job status without logging tokens or input payloads', async () => {
    const { baseUrl, registry } = await startServer();
    const response = await postJob(baseUrl, {
      type: 'echo',
      input: { privateValue: 'do-not-log-this' },
    });
    const accepted = await response.json();
    await waitForStatus(registry, accepted.jobId, 'succeeded');

    const statusResponse = await fetch(`${baseUrl}/v1/jobs/${accepted.jobId}`, {
      headers: { authorization: 'Bearer test-token' },
    });
    const auditText = JSON.stringify(registry.getAuditLog());

    expect(response.status).toBe(202);
    expect(accepted).toEqual({ jobId: expect.any(String), status: 'queued' });
    expect(statusResponse.status).toBe(200);
    expect(await statusResponse.json()).toMatchObject({
      jobId: accepted.jobId,
      type: 'echo',
      status: 'succeeded',
    });
    expect(auditText).not.toContain('do-not-log-this');
    expect(auditText).not.toContain('test-token');
  });
});

