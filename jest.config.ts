import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Load next.config + .env into the test environment.
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Mirror the tsconfig "@/*" path alias.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

// Exported this way so next/jest can load the (async) Next.js config.
export default createJestConfig(config);
