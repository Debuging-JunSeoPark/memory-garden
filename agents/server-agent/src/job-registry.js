import { randomUUID } from 'node:crypto';

function timeoutAfter(timeoutMs) {
  return new Promise((_, reject) => {
    const timer = setTimeout(() => {
      const error = new Error('Job timed out');
      error.code = 'TIMEOUT';
      reject(error);
    }, timeoutMs);
    timer.unref?.();
  });
}

export function createJobRegistry({ executors, timeoutMs = 30_000 }) {
  if (!executors || typeof executors !== 'object') throw new Error('executors are required');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30_000) {
    throw new Error('timeoutMs must be between 1 and 30000');
  }

  const jobs = new Map();
  const idempotencyKeys = new Map();
  const auditLog = [];

  function audit(job) {
    auditLog.push({
      jobId: job.jobId,
      type: job.type,
      status: job.status,
      timestamp: job.updatedAt,
    });
  }

  function update(job, patch) {
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    audit(job);
  }

  async function execute(job, input) {
    update(job, { status: 'running' });
    try {
      const result = await Promise.race([executors[job.type](input), timeoutAfter(timeoutMs)]);
      update(job, { status: 'succeeded', result });
    } catch (error) {
      update(job, { status: 'failed', error: error.code ?? 'EXECUTION_FAILED' });
    }
  }

  return {
    hasType(type) {
      return typeof executors[type] === 'function';
    },
    enqueue({ type, input, idempotencyKey }) {
      if (!this.hasType(type)) throw new Error(`Unknown job type: ${type}`);
      if (idempotencyKey && idempotencyKeys.has(idempotencyKey)) {
        return jobs.get(idempotencyKeys.get(idempotencyKey));
      }

      const now = new Date().toISOString();
      const job = { jobId: randomUUID(), type, status: 'queued', createdAt: now, updatedAt: now };
      jobs.set(job.jobId, job);
      if (idempotencyKey) idempotencyKeys.set(idempotencyKey, job.jobId);
      audit(job);
      queueMicrotask(() => execute(job, input));
      return job;
    },
    get(jobId) {
      const job = jobs.get(jobId);
      return job ? structuredClone(job) : undefined;
    },
    getAuditLog() {
      return structuredClone(auditLog);
    },
  };
}

