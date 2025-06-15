"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        setupFiles: ['tests/setup-env.ts', 'tests/setup.ts'],
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
});
