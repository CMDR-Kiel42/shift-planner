import type {Config} from 'jest';
import {defaults} from 'jest-config';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./tests/jest.setup.ts'],
};

export default config;