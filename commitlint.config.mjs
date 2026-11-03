const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['build', 'chore', 'content', 'docs', 'feat', 'fix', 'refactor', 'style', 'test', 'deploy']],
  },
};
export default config;
