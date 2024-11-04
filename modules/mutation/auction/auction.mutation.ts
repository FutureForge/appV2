import { useUserChainInfo } from '@/modules/query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendAndConfirmTransaction } from 'thirdweb'

export function useCreateAuctionMutation() {
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
  