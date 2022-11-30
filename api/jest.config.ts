import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '^@repositories/(.*)': '<rootDir>/shared/repositories/$1',
    '^@services/(.*)': '<rootDir>/shared/services/$1',
    '^@dtos/(.*)': '<rootDir>/shared/dtos/$1',
    '^@user/(.*)': '<rootDir>/user/$1',
    '^@mocks/(.*)': '<rootDir>/shared/mocks/$1',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/main.ts',
    '<rootDir>/shared/services/prisma.service.ts',
  ],
};

export default config;
