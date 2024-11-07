export * from "./collection/collection.mutation";
export * from "./auction/auction.mutation";
export * from "./listing/listing.mutation";
export * from "./offer/offer.mutation";
export * from "./global/global.mutation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
// syntax
export function useMutationExample() {
  // call needed functions

  return useMutation({
    mutationFn: async () => {
      // your mutation logic here
    },
    onSuccess: (data, variables, context) => {
      // your success callback here
    },
    onError: (error, variables, context) => {
      // your error callback here
    },
    // other options like retry, etc.
  });
}
