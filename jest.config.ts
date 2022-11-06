// jest.config.ts
import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  preset: '@shelf/jest-dynamodb',
  setupFiles: ["<rootDir>/platform-service/test/setEnvVars.js"],
};
export default config;