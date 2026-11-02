"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string;
  reload: () => void;
}

/**
 * Runs an existing service call on mount (and whenever deps change), with a
 * consistent loading / error / retry contract. The fetchers themselves are
 * unchanged, so backend contracts stay as they are.
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = [], fallbackError = "Unable to load this content."): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetcher()
      .then((result) => {
        if (!cancelled && alive.current) setData(result);
      })
      .catch((err: unknown) => {
        if (cancelled || !alive.current) return;
        console.error(err);
        setError(err instanceof Error && err.message ? err.message : fallbackError);
      })
      .finally(() => {
        if (!cancelled && alive.current) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, reload };
}
