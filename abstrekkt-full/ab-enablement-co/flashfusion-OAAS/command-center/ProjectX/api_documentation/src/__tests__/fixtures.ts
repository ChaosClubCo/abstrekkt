import type { OpenApiSpec, Operation } from '../types';

export const mockOperation: Operation = {
  operationId: 'getUsers',
  summary: 'Get all users',
  description: 'Retrieves a list of all users',
  tags: ['Users'],
  parameters: [
    {
      name: 'limit',
      in: 'query',
      description: 'Maximum number of users to return',
      required: false,
      schema: { type: 'integer', example: 10 },
    },
  ],
  responses: {
    '200': {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
        },
      },
    },
  },
};

export const mockCreateOperation: Operation = {
  operationId: 'createUser',
  summary: 'Create a new user',
  tags: ['Users'],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/CreateUserInput' },
      },
    },
  },
  responses: {
    '201': {
      description: 'User created successfully',
    },
  },
};

export const mockSpec: OpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Test API',
    version: '1.0.0',
    description: 'A test API for documentation',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://api.example.com/v1',
      description: 'Production server',
    },
    {
      url: 'https://staging-api.example.com/v1',
      description: 'Staging server',
    },
  ],
  paths: {
    '/users': {
      get: mockOperation,
      post: mockCreateOperation,
    },
    '/users/{id}': {
      get: {
        operationId: 'getUserById',
        summary: 'Get user by ID',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'User found' },
          '404': { description: 'User not found' },
        },
      },
      delete: {
        operationId: 'deleteUser',
        summary: 'Delete user',
        tags: ['Users'],
        responses: {
          '204': { description: 'User deleted' },
        },
      },
    },
    '/projects': {
      get: {
        operationId: 'getProjects',
        summary: 'Get all projects',
        tags: ['Projects'],
        responses: {
          '200': { description: 'Projects list' },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier' },
          name: { type: 'string', description: 'User name' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'email'],
      },
      CreateUserInput: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
        required: ['name', 'email'],
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'active', 'archived'] },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Projects', description: 'Project management endpoints' },
  ],
};

export const mockEmptySpec: OpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Empty API',
    version: '0.0.1',
  },
  servers: [],
  paths: {},
};
