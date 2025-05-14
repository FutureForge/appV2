export const QUERY_DEFAULTS = {
  STALE_TIME: 1000 * 30, // 30 seconds
  GC_TIME: 1000 * 60 * 5, // 5 minutes
  REFETCH_INTERVAL: 10000, // 10 seconds
  EVENT_QUERY_LIMIT: 1000,
};

export const QUERY_OPTIONS = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
};
