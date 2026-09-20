import { useState, useEffect, useCallback } from "react";
import { useElectronAPI } from "./useElectronAPI";

interface UpdateState {
  checking: boolean;
  available: boolean;
  downloading: boolean;
  downloaded: boolean;
  version: string | null;
  error: string | null;
  check: () => Promise<void>;
  download: () => Promise<void>;
  install: () => void;
}

/**
 * Auto-update lifecycle hook for Electron apps.
 */
export function useAutoUpdate(): UpdateState {
  const api = useElectronAPI();
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const removeAvailable = api.onUpdateAvailable((info: unknown) => {
      setAvailable(true);
      setVersion((info as { version?: string })?.version ?? null);
    });

    const removeDownloaded = api.onUpdateDownloaded(() => {
      setDownloaded(true);
      setDownloading(false);
    });

    return () => {
      removeAvailable();
      removeDownloaded();
    };
  }, [api]);

  const check = useCallback(async () => {
    setChecking(true);
    setError(null);
    try {
      const info = await api.checkForUpdate();
      if (info) {
        setAvailable(true);
        setVersion((info as { version?: string })?.version ?? null);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setChecking(false);
    }
  }, [api]);

  const download = useCallback(async () => {
    setDownloading(true);
    setError(null);
    try {
      await api.downloadUpdate();
    } catch (err) {
      setError(String(err));
      setDownloading(false);
    }
  }, [api]);

  const install = useCallback(() => {
    api.installUpdate();
  }, [api]);

  return { checking, available, downloading, downloaded, version, error, check, download, install };
}
