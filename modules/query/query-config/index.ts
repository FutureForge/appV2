export const QUERY_DEFAULTS = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  GC_TIME: 1000 * 60 * 30, // 30 minutes
  REFETCH_INTERVAL: 1000 * 60 * 5, // 5 minutes
  // REFETCH_INTERVAL: 5000, // 5 seconds
  EVENT_QUERY_LIMIT: 1000,
};

export const QUERY_OPTIONS = {
  defaultOptions: {
    queries: {
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      retry: (failureCount: number, error: any) => {
        // Exponential backoff for 429 errors
        if (error?.status === 429) {
          return failureCount < 3;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex: number, error: any) => {
        if (error?.status === 429) {
          return Math.min(1000 * 2 ** attemptIndex, 30000); // up to 30s
        }
        return 1000;
      },
    },
  },
};
