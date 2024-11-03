export * from "./listing";
export * from "./auction";
export * from "./offers";
export * from "./collection";
export * from "./nft";
export * from "./user";

import { useQuery, useQueryClient } from "@tanstack/react-query";

// syntax
export function useQueryExample() {
  // call needed functions

  return useQuery({
    queryKey: ["exampleQueryKey"],
    queryFn: async () => {},
    initialData: null,
    enabled: true,
    refetchInterval: 60000, // refetch every minute
  });
}
