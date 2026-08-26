export interface OpenApiSpec {
  openapi: string;
  info: ApiInfo;
  servers: ApiServer[];
  paths: Record<string, PathItem>;
  components?: Components;
  tags?: ApiTag[];
}

export interface ApiInfo {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

export interface ApiServer {
  url: string;
  description?: string;
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  patch?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
}

export interface Operation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  security?: SecurityRequirement[];
  deprecated?: boolean;
}

export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema: Schema;
}

export interface RequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, MediaType>;
}

export interface Response {
  description: string;
  content?: Record<string, MediaType>;
}

export interface MediaType {
  schema: Schema;
  example?: unknown;
}

export interface Schema {
  type?: string;
  format?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  required?: string[];
  enum?: unknown[];
  description?: string;
  example?: unknown;
  $ref?: string;
}

export interface Components {
  schemas?: Record<string, Schema>;
  securitySchemes?: Record<string, SecurityScheme>;
}

export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
}

export interface SecurityRequirement {
  [name: string]: string[];
}

export interface ApiTag {
  name: string;
  description?: string;
}

export interface Endpoint {
  method: string;
  path: string;
  operation: Operation;
}

export interface ApiDocsConfig {
  title: string;
  version: string;
  description?: string;
  servers: ApiServer[];
  tags?: ApiTag[];
}
