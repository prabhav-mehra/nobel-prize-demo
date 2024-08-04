const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

/** @type {import('jest').Config} */
const config = {
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	testEnvironment: "jsdom",

	// Path alias mapping
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1", // Adjust mapping according to your alias setup
	},

	// Other configuration options...
};

module.exports = createJestConfig(config);
