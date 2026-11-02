const LOCAL_HOSTS = new Set(['127.0.0.1', '::1', 'localhost']);

function positiveInteger(value, fallback, name) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${name} must be a positive integer`);
  return parsed;
}

export function loadConfig(environment) {
  const token = environment.SERVER_AGENT_TOKEN;
  if (!token) throw new Error('SERVER_AGENT_TOKEN is required');

  const host = environment.SERVER_AGENT_HOST ?? '127.0.0.1';
  if (!LOCAL_HOSTS.has(host)) {
    throw new Error('SERVER_AGENT_HOST must resolve to localhost');
  }

  return {
    host,
    port: positiveInteger(environment.SERVER_AGENT_PORT, 4310, 'SERVER_AGENT_PORT'),
    token,
    bodyLimitBytes: positiveInteger(
      environment.SERVER_AGENT_BODY_LIMIT_BYTES,
      65_536,
      'SERVER_AGENT_BODY_LIMIT_BYTES',
    ),
    taskTimeoutMs: positiveInteger(
      environment.SERVER_AGENT_TASK_TIMEOUT_MS,
      30_000,
      'SERVER_AGENT_TASK_TIMEOUT_MS',
    ),
  };
}

