/**
 * GitHub service tests
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
// import { parseRepositoryUrl } from '../src/github/fetchRepo.js';
import { detectTechnologyStack } from '../src/github/detectStack.js';

describe('GitHub Integration', () => {
  describe('Repository URL Parsing', () => {
    // test('should parse standard GitHub URL', () => {
    //   const url = 'https://github.com/facebook/react';
    //   const result = parseRepositoryUrl(url);
    //   
    //   assert.strictEqual(result.success, true);
    //   assert.strictEqual(result.owner, 'facebook');
    //   assert.strictEqual(result.repo, 'react');
    //   assert.strictEqual(result.fullName, 'facebook/react');
    // });

    // test('should parse GitHub URL with .git extension', () => {
    //   const url = 'https://github.com/vercel/next.js.git';
    //   const result = parseRepositoryUrl(url);
    //   
    //   assert.strictEqual(result.success, true);
    //   assert.strictEqual(result.owner, 'vercel');
    //   assert.strictEqual(result.repo, 'next.js');
    //   assert.strictEqual(result.fullName, 'vercel/next.js');
    // });

    // test('should parse GitHub URL with additional path', () => {
    //   const url = 'https://github.com/microsoft/vscode/tree/main';
    //   const result = parseRepositoryUrl(url);
    //   
    //   assert.strictEqual(result.success, true);
    //   assert.strictEqual(result.owner, 'microsoft');
    //   assert.strictEqual(result.repo, 'vscode');
    // });

    // test('should reject invalid URL', () => {
    //   const url = 'https://example.com/not-github';
    //   const result = parseRepositoryUrl(url);
    //   
    //   assert.strictEqual(result.success, false);
    //   assert.ok(result.error);
    // });

    // test('should reject malformed GitHub URL', () => {
    //   const url = 'https://github.com/owner';
    //   const result = parseRepositoryUrl(url);
    //   
    //   assert.strictEqual(result.success, false);
    //   assert.ok(result.error);
    // });
  });

  describe('Technology Stack Detection', () => {
    test('should detect React from package.json', () => {
      const repositoryData = {
        configFiles: {
          'package.json': JSON.stringify({
            dependencies: {
              'react': '^18.0.0',
              'react-dom': '^18.0.0'
            }
          })
        },
        readme: 'This is a React application',
        fileStructure: [],
        repositoryInfo: {
          primaryLanguage: 'JavaScript',
          languages: [{ name: 'JavaScript', percentage: 80 }]
        }
      };

      const stack = detectTechnologyStack(repositoryData);
      
      assert.ok(stack.frameworks.some(fw => fw.name === 'React'));
      assert.ok(stack.frameworks.find(fw => fw.name === 'React').confidence > 50);
    });

    test('should detect Next.js from config and dependencies', () => {
      const repositoryData = {
        configFiles: {
          'package.json': JSON.stringify({
            dependencies: {
              'next': '^13.0.0',
              'react': '^18.0.0'
            }
          }),
          'next.config.js': 'module.exports = { /* config */ }'
        },
        readme: 'Built with Next.js',
        fileStructure: [],
        repositoryInfo: {
          primaryLanguage: 'JavaScript',
          languages: [{ name: 'JavaScript', percentage: 90 }]
        }
      };

      const stack = detectTechnologyStack(repositoryData);
      
      assert.ok(stack.frameworks.some(fw => fw.name === 'Next.js'));
      assert.ok(stack.frameworks.some(fw => fw.name === 'React'));
    });

    test('should detect TypeScript from dependencies and files', () => {
      const repositoryData = {
        configFiles: {
          'package.json': JSON.stringify({
            devDependencies: {
              'typescript': '^4.9.0',
              '@types/react': '^18.0.0'
            }
          }),
          'tsconfig.json': '{ "compilerOptions": {} }'
        },
        readme: 'TypeScript project',
        fileStructure: [],
        repositoryInfo: {
          primaryLanguage: 'TypeScript',
          languages: [{ name: 'TypeScript', percentage: 85 }]
        }
      };

      const stack = detectTechnologyStack(repositoryData);
      
      assert.ok(stack.tools.some(tool => tool.name === 'TypeScript'));
    });

    test('should detect multiple technologies correctly', () => {
      const repositoryData = {
        configFiles: {
          'package.json': JSON.stringify({
            dependencies: {
              'react': '^18.0.0',
              'express': '^4.18.0',
              '@supabase/supabase-js': '^2.0.0'
            },
            devDependencies: {
              'typescript': '^4.9.0',
              'tailwindcss': '^3.0.0'
            }
          }),
          'tailwind.config.js': 'module.exports = { /* config */ }',
          'Dockerfile': 'FROM node:18'
        },
        readme: 'Full-stack React app with Express backend',
        fileStructure: [],
        repositoryInfo: {
          primaryLanguage: 'TypeScript',
          languages: [
            { name: 'TypeScript', percentage: 70 },
            { name: 'JavaScript', percentage: 30 }
          ]
        }
      };

      const stack = detectTechnologyStack(repositoryData);
      
      // Should detect frontend framework
      assert.ok(stack.frameworks.some(fw => fw.name === 'React'));
      
      // Should detect backend framework
      assert.ok(stack.backend.some(be => be.name === 'Express.js'));
      
      // Should detect database
      assert.ok(stack.databases.some(db => db.name === 'Supabase'));
      
      // Should detect styling
      assert.ok(stack.styling.some(style => style.name === 'Tailwind CSS'));
      
      // Should detect tools
      assert.ok(stack.tools.some(tool => tool.name === 'TypeScript'));
      
      // Should detect cloud/deployment
      assert.ok(stack.cloud.some(cloud => cloud.name === 'Docker'));
    });

    test('should handle empty or invalid data gracefully', () => {
      const repositoryData = {
        configFiles: {},
        readme: null,
        fileStructure: [],
        repositoryInfo: null
      };

      const stack = detectTechnologyStack(repositoryData);
      
      assert.ok(Array.isArray(stack.frameworks));
      assert.ok(Array.isArray(stack.backend));
      assert.ok(Array.isArray(stack.databases));
      assert.ok(Array.isArray(stack.tools));
      assert.strictEqual(stack.primaryLanguage, 'Unknown');
    });

    test('should detect package managers correctly', () => {
      const repositoryData = {
        configFiles: {
          'package.json': '{}',
          'yarn.lock': 'yarn lock file',
          'requirements.txt': 'django==4.0.0'
        },
        readme: '',
        fileStructure: [],
        repositoryInfo: {
          primaryLanguage: 'Python',
          languages: [{ name: 'Python', percentage: 100 }]
        }
      };

      const stack = detectTechnologyStack(repositoryData);
      
      assert.ok(stack.packageManagers.includes('npm'));
      assert.ok(stack.packageManagers.includes('yarn'));
      assert.ok(stack.packageManagers.includes('pip'));
    });
  });

  describe('Technology Confidence Scoring', () => {
    test('should give higher confidence for multiple evidence sources', () => {
      const repositoryData = {
        configFiles: {
          'package.json': JSON.stringify({
            dependencies: { 'react': '^18.0.0' }
          })
        },
        readme: 'This React application uses modern hooks and components',
        fileStructure: [
          { name: 'src', type: 'dir' },
          { name: 'App.jsx', type: 'file' }
        ],
        repositoryInfo: {
          primaryLanguage: 'JavaScript',
          languages: [{ name: 'JavaScript', percentage: 90 }]
        }
      };

      const stack = detectTechnologyStack(repositoryData);
      const reactFramework = stack.frameworks.find(fw => fw.name === 'React');
      
      assert.ok(reactFramework);
      assert.ok(reactFramework.confidence > 70); // High confidence due to multiple evidence
    });

    test('should give lower confidence for single evidence source', () => {
      const repositoryData = {
        configFiles: {},
        readme: 'Mentions React somewhere in the documentation',
        fileStructure: [],
        repositoryInfo: {
          primaryLanguage: 'JavaScript',
          languages: [{ name: 'JavaScript', percentage: 100 }]
        }
      };

      const stack = detectTechnologyStack(repositoryData);
      const reactFramework = stack.frameworks.find(fw => fw.name === 'React');
      
      // Should either not detect or have low confidence
      if (reactFramework) {
        assert.ok(reactFramework.confidence < 50);
      }
    });
  });
});