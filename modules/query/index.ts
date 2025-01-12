export * from "./listing/listing.query";
export * from './listing/listing.blockchain.query'
export * from "./auction/auction.query";
export * from "./auction/auction.blockchain.query";
export * from "./offers/offers.query";
export * from "./collection/collection.query.";
export * from "./nft/nft.query";
export * from "./user/user.query";
export * from "./lib/lib.query";

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
