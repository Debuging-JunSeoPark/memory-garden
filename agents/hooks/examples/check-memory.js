import { resolve } from 'node:path';
import { validateRepository } from '../../../scripts/validate-repository.mjs';

const result = await validateRepository(resolve(import.meta.dirname, '../../..'));
const memoryErrors = result.errors.filter(
  (error) => error.includes('agents/memories/') || error.includes('secret marker'),
);

if (memoryErrors.length > 0) {
  for (const error of memoryErrors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Public agent memories passed validation.');
}

