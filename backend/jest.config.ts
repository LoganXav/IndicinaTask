export default {
  preset: "ts-jest",
  // testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/*.test.ts", "!src/**/__tests__/**"],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^~/api/(.*)$": "<rootDir>/src/api/$1",
    "^~/config/(.*)$": "<rootDir>/src/config/$1",
    "^~/helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^~/infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^~/types/(.*)$": "<rootDir>/src/types/$1",
    "^~/utils/(.*)$": "<rootDir>/src/utils/$1",
  },
  moduleFileExtensions: ["js", "ts", "json", "node"],
};
