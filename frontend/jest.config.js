module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "^next/image$": "<rootDir>/__mocks__/nextImageMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["/node_modules/"],
};
