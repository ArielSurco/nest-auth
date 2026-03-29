import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!db/**',
    '!**/*.spec.ts',
    '!**/*.d.ts',
    '!**/*.module.ts',
    '!main.ts',
    '!**/infrastructure/entities/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
    '^uuid$': '<rootDir>/__mocks__/uuid.ts',
  },
};

export default config;
