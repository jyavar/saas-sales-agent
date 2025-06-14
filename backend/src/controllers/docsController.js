/**
 * Documentation controller
 */

import { logger } from '../utils/common/logger.js';

export class DocsController {
  /**
   * Swagger UI
   */
  async swaggerUI(req, res) {
    try {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Strato AI Backend API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      logger.error('Error serving Swagger UI', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to load documentation'
      });
    }
  }

  /**
   * OpenAPI specification
   */
  async openApiSpec(req, res) {
    try {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Strato AI Sales Agent Backend API',
          version: '1.0.0',
          description: 'Multi-tenant SaaS backend with CURSOR integration and frontend compatibility',
          contact: {
            name: 'Strato AI Team',
            email: 'support@stratoai.com'
          }
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Development server'
          },
          {
            url: 'https://api.stratoai.com',
            description: 'Production server'
          }
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'JWT token for frontend authentication'
            },
            ApiKeyAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'API Key',
              description: 'API key for CURSOR agent authentication'
            }
          },
          parameters: {
            TenantId: {
              name: 'X-Tenant-ID',
              in: 'header',
              description: 'Tenant ID or slug for multi-tenant operations',
              required: false,
              schema: {
                type: 'string'
              }
            }
          }
        },
        paths: {
          '/health': {
            get: {
              summary: 'Basic health check',
              description: 'Returns basic health status of the API',
              responses: {
                '200': {
                  description: 'API is healthy',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: { type: 'boolean' },
                          status: { type: 'string' },
                          timestamp: { type: 'string' },
                          uptime: { type: 'number' },
                          version: { type: 'string' },
                          features: { type: 'object' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/api/agent-actions': {
            post: {
              summary: 'Create agent action (CURSOR)',
              description: 'Create a new action for AI agents from CURSOR',
              security: [{ ApiKeyAuth: [] }],
              parameters: [{ $ref: '#/components/parameters/TenantId' }],
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      required: ['actionType', 'agentId', 'payload'],
                      properties: {
                        actionType: {
                          type: 'string',
                          enum: ['create_lead', 'update_lead', 'send_email', 'analyze_company']
                        },
                        agentId: { type: 'string' },
                        priority: {
                          type: 'string',
                          enum: ['low', 'normal', 'high', 'urgent'],
                          default: 'normal'
                        },
                        payload: { type: 'object' },
                        context: { type: 'object' }
                      }
                    }
                  }
                }
              },
              responses: {
                '201': {
                  description: 'Action created successfully',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: { type: 'boolean' },
                          action: { type: 'object' }
                        }
                      }
                    }
                  }
                }
              }
            },
            get: {
              summary: 'List agent actions',
              description: 'Get list of agent actions for the tenant',
              security: [{ ApiKeyAuth: [] }],
              parameters: [{ $ref: '#/components/parameters/TenantId' }],
              responses: {
                '200': {
                  description: 'Actions retrieved successfully'
                }
              }
            }
          },
          '/api/leads': {
            get: {
              summary: 'List leads (Frontend)',
              description: 'Get list of leads for the authenticated user\'s tenant',
              security: [{ BearerAuth: [] }],
              parameters: [{ $ref: '#/components/parameters/TenantId' }],
              responses: {
                '200': {
                  description: 'Leads retrieved successfully'
                }
              }
            },
            post: {
              summary: 'Create lead (Frontend)',
              description: 'Create a new lead in the user\'s tenant',
              security: [{ BearerAuth: [] }],
              parameters: [{ $ref: '#/components/parameters/TenantId' }],
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      required: ['email', 'firstName', 'lastName'],
                      properties: {
                        email: { type: 'string', format: 'email' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        company: { type: 'string' },
                        jobTitle: { type: 'string' },
                        phone: { type: 'string' },
                        source: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } }
                      }
                    }
                  }
                }
              },
              responses: {
                '201': {
                  description: 'Lead created successfully'
                }
              }
            }
          },
          '/api/auth/register': {
            post: {
              summary: 'Register user and create tenant',
              description: 'Register a new user and create their tenant',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      required: ['email', 'password', 'name', 'tenantName'],
                      properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 8 },
                        name: { type: 'string' },
                        tenantName: { type: 'string' }
                      }
                    }
                  }
                }
              },
              responses: {
                '201': {
                  description: 'Registration successful'
                }
              }
            }
          },
          '/api/auth/login': {
            post: {
              summary: 'Login user',
              description: 'Authenticate user and return JWT token',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      required: ['email', 'password'],
                      properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: 'Login successful'
                }
              }
            }
          }
        }
      };

      res.json(spec);
    } catch (error) {
      logger.error('Error generating OpenAPI spec', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to generate API specification'
      });
    }
  }

  /**
   * Multi-tenant guide
   */
  async multiTenantGuide(req, res) {
    try {
      const guide = {
        title: 'Multi-Tenant API Guide',
        description: 'How to use the Strato AI API in a multi-tenant environment',
        sections: {
          tenantIdentification: {
            title: 'Tenant Identification',
            description: 'How to specify which tenant you\'re working with',
            methods: [
              {
                method: 'X-Tenant-ID Header',
                priority: 1,
                description: 'Pass tenant ID or slug in the X-Tenant-ID header',
                example: 'X-Tenant-ID: acme-corp'
              },
              {
                method: 'JWT Claims',
                priority: 2,
                description: 'Tenant ID is extracted from JWT token claims',
                example: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIs...'
              },
              {
                method: 'Subdomain',
                priority: 3,
                description: 'Tenant slug is extracted from subdomain',
                example: 'https://acme-corp.stratoai.app/api/leads'
              }
            ]
          },
          authentication: {
            title: 'Authentication Methods',
            methods: [
              {
                type: 'JWT (Frontend)',
                description: 'For web applications and user interfaces',
                usage: 'Authorization: Bearer <jwt_token>',
                endpoints: ['leads', 'campaigns', 'analytics', 'tenant management']
              },
              {
                type: 'API Key (CURSOR)',
                description: 'For AI agents and automated systems',
                usage: 'Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents',
                endpoints: ['agent-actions', 'leads (read-only)', 'system status']
              }
            ]
          },
          examples: {
            title: 'Usage Examples',
            cursor: {
              title: 'CURSOR Agent Example',
              description: 'Creating a lead from CURSOR',
              code: `curl -X POST http://localhost:3000/api/agent-actions \\
  -H "Authorization: Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents" \\
  -H "X-Tenant-ID: acme-corp" \\
  -H "Content-Type: application/json" \\
  -d '{
    "actionType": "create_lead",
    "agentId": "cursor-prospector-v1",
    "payload": {
      "leadData": {
        "email": "prospect@company.com",
        "firstName": "John",
        "lastName": "Doe",
        "company": "Tech Corp"
      }
    }
  }'`
            },
            frontend: {
              title: 'Frontend Example',
              description: 'Fetching leads from Next.js',
              code: `const response = await fetch('/api/leads', {
  headers: {
    'Authorization': \`Bearer \${userToken}\`,
    'X-Tenant-ID': 'acme-corp',
    'Content-Type': 'application/json'
  }
});

const { leads } = await response.json();`
            }
          }
        }
      };

      res.json(guide);
    } catch (error) {
      logger.error('Error generating multi-tenant guide', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to generate guide'
      });
    }
  }

  /**
   * CURSOR integration guide
   */
  async cursorGuide(req, res) {
    try {
      const guide = {
        title: 'CURSOR Integration Guide',
        description: 'How to integrate AI agents with Strato AI backend',
        quickStart: {
          title: 'Quick Start',
          steps: [
            {
              step: 1,
              title: 'Get API Key',
              description: 'Use the default CURSOR API key or create a new one',
              apiKey: 'sk-strato-agent-2025-secure-token-for-cursor-ai-agents'
            },
            {
              step: 2,
              title: 'Set Headers',
              description: 'Include required headers in your requests',
              headers: {
                'Authorization': 'Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents',
                'X-Tenant-ID': 'your-tenant-slug',
                'X-Agent-ID': 'cursor-agent-v1',
                'Content-Type': 'application/json'
              }
            },
            {
              step: 3,
              title: 'Make Requests',
              description: 'Send actions to the agent-actions endpoint',
              endpoint: 'POST /api/agent-actions'
            }
          ]
        },
        actionTypes: {
          title: 'Supported Action Types',
          actions: [
            {
              type: 'create_lead',
              description: 'Create a new lead',
              payload: {
                leadData: {
                  email: 'string (required)',
                  firstName: 'string (required)',
                  lastName: 'string (required)',
                  company: 'string (optional)',
                  jobTitle: 'string (optional)',
                  source: 'string (optional)',
                  tags: 'array (optional)'
                }
              }
            },
            {
              type: 'update_lead',
              description: 'Update an existing lead',
              payload: {
                leadId: 'string (required)',
                updates: 'object (required)'
              }
            },
            {
              type: 'send_email',
              description: 'Send an email',
              payload: {
                communicationData: {
                  type: 'email',
                  recipient: 'string (required)',
                  subject: 'string (required)',
                  content: 'string (required)'
                }
              }
            },
            {
              type: 'analyze_company',
              description: 'Analyze a company',
              payload: {
                analysisData: {
                  companyName: 'string (required)',
                  website: 'string (optional)'
                }
              }
            }
          ]
        },
        examples: {
          title: 'Complete Examples',
          createLead: {
            title: 'Create Lead',
            code: `const response = await fetch('http://localhost:3000/api/agent-actions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-strato-agent-2025-secure-token-for-cursor-ai-agents',
    'X-Tenant-ID': 'acme-corp',
    'X-Agent-ID': 'cursor-prospector-v1',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    actionType: 'create_lead',
    agentId: 'cursor-prospector-v1',
    priority: 'high',
    payload: {
      leadData: {
        email: 'prospect@company.com',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Tech Corp',
        jobTitle: 'CEO',
        source: 'ai_agent',
        tags: ['high-value', 'tech-ceo']
      }
    },
    context: {
      source: 'cursor_agent',
      correlationId: 'analysis-session-123'
    }
  })
});

const result = await response.json();
console.log('Lead created:', result);`
          }
        },
        rateLimits: {
          title: 'Rate Limits',
          limits: [
            {
              type: 'Agent Actions',
              limit: '200 requests per minute',
              scope: 'Per API key'
            },
            {
              type: 'Lead Creation',
              limit: '50 leads per minute',
              scope: 'Per tenant'
            }
          ]
        },
        troubleshooting: {
          title: 'Troubleshooting',
          issues: [
            {
              issue: '401 Unauthorized',
              cause: 'Invalid or missing API key',
              solution: 'Check that you\'re using the correct API key in the Authorization header'
            },
            {
              issue: '403 Forbidden',
              cause: 'API key doesn\'t have access to tenant',
              solution: 'Verify the X-Tenant-ID header and API key permissions'
            },
            {
              issue: '429 Too Many Requests',
              cause: 'Rate limit exceeded',
              solution: 'Reduce request frequency or implement exponential backoff'
            }
          ]
        }
      };

      res.json(guide);
    } catch (error) {
      logger.error('Error generating CURSOR guide', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to generate guide'
      });
    }
  }
}

export const docsController = new DocsController();
export default docsController;