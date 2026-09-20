import React, { useMemo } from 'react';
import type { CacheConfig, CacheProviderProps } from '../types';
import { CacheClient } from '../api';
import { CacheContext } from '../hooks';

const defaultConfig: CacheConfig = {
  redis: {
    url: 'redis://localhost:6379',
    maxRetries: 3,
    connectTimeout: 5000,
  },
  defaultTTL: 300,
  keyPrefix: 'app:',
  serializer: 'json',
  enableL1Cache: true,
  l1MaxSize: 1000,
};

export function CacheProvider({ config, children, fallback }: CacheProviderProps) {
  const mergedConfig = useMemo(
    () => ({
      ...defaultConfig,
      ...config,
      redis: { ...defaultConfig.redis, ...config.redis },
    }),
    [config]
  );

  const client = useMemo(() => new CacheClient(mergedConfig), [mergedConfig]);

  const contextValue = useMemo(
    () => ({
      client,
      config: mergedConfig,
    }),
    [client, mergedConfig]
  );

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}
