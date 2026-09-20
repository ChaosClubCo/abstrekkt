import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { OpenApiSpec, Endpoint } from '../types';

export function useApiSpec(specUrl = '/api/openapi.json') {
  const { data: spec, isLoading, error } = useQuery({
    queryKey: ['openApiSpec', specUrl],
    queryFn: async () => {
      const response = await axios.get<OpenApiSpec>(specUrl);
      return response.data;
    },
  });

  const endpoints: Endpoint[] = spec
    ? Object.entries(spec.paths).flatMap(([path, pathItem]) =>
        Object.entries(pathItem)
          .filter(([method]) => ['get', 'post', 'put', 'patch', 'delete'].includes(method))
          .map(([method, operation]) => ({
            method: method.toUpperCase(),
            path,
            operation: operation as Endpoint['operation'],
          }))
      )
    : [];

  return {
    spec,
    endpoints,
    isLoading,
    error,
  };
}

export function useEndpoint(path: string, method: string) {
  const { spec, isLoading } = useApiSpec();

  const endpoint = spec?.paths[path]?.[method.toLowerCase() as keyof typeof spec.paths[string]];

  return {
    endpoint: endpoint as Endpoint['operation'] | undefined,
    isLoading,
  };
}

export function useApiSchema(schemaRef: string) {
  const { spec, isLoading } = useApiSpec();

  // Parse $ref like "#/components/schemas/User"
  const schemaName = schemaRef.split('/').pop();
  const schema = schemaName ? spec?.components?.schemas?.[schemaName] : undefined;

  return {
    schema,
    isLoading,
  };
}
