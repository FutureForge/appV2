import {
  getBidInAuction,
  getCollectAuctionPayout,
  getCollectAuctionTokens,
} from "@/modules/blockchain";
import {
  getAcceptOffer,
  getCancelOffer,
} from "@/modules/blockchain/offer/offer.blockchain";
import { useUserChainInfo } from "@/modules/query";
import { queryKeys } from "@/modules/query/query-keys";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "thirdweb";

// export function useMakeListingOfferMutation() {
//   const toast = useToast();
//   const queryClient = useQueryClient();
//   const { activeAccount } = useUserChainInfo();
//   const increaseAllowanceMutation = useIncreaseAllowanceMutation();
//   const convertXFIToWXFIMutation = useConvertXFIToWXFIMutation();

//   return useMutation({
//     mutationFn: async ({
//       makeOffer,
//     }: {
//       makeOffer: Partial<MakeOfferListingType>;
//     }) => {
//       if (!activeAccount) return toast.error("Please connect your wallet");

//       const WXFIContract = await getContractEthers({
//         contractAddress: CROSSFI_WRAPPED_TOKEN_CONTRACT,
//         abi: WXFIAbi,
//       });

//       const makeOfferValue = decimalOnChain(makeOffer.totalPrice!);
//       const wxfiBalanceRaw = await WXFIContract.balanceOf(
//         activeAccount.address
//       );

//       // Step 1: Convert XFI to WXFI if needed
//       if (BigNumber.from(wxfiBalanceRaw).lt(makeOfferValue!)) {
//         await toast.loading("Wrapping XFI to WXFI");
//         await convertXFIToWXFIMutation.mutateAsync({
//           amount: makeOffer.totalPrice!,
//         });

//         const updatedWxfiBalance = await WXFIContract.balanceOf(
//           activeAccount.address
//         );
//         if (BigNumber.from(updatedWxfiBalance).lt(makeOfferValue!)) {
//           throw new Error("Insufficient WXFI balance after conversion");
//         }
//       }

//       // Step 2: Increase allowance if needed
//       const currentAllowance = await WXFIContract.allowance(
//         activeAccount?.address,
//         CROSSFI_MARKETPLACE_CONTRACT
//       );
//       if (BigNumber.from(currentAllowance).lt(makeOfferValue!)) {
//         await toast.loading("Approving WXFI to spend");
//         await increaseAllowanceMutation.mutateAsync({
//           amount: makeOfferValue!.toString(),
//         });

//         const updatedAllowance = await WXFIContract.allowance(
//           activeAccount?.address,
//           CROSSFI_MARKETPLACE_CONTRACT
//         );
//         if (BigNumber.from(updatedAllowance).lt(makeOfferValue!)) {
//           throw new Error("Insufficient allowance after approval");
//         }
//       }

//       const transaction = await getMakeOffer({
//         params: {
//           assetContract: makeOffer.assetContract ?? "",
//           tokenId: makeOffer.tokenId ?? "",
//           quantity: makeOffer.quantity ?? "",
//           currency: CROSSFI_WRAPPED_TOKEN_CONTRACT,
//           totalPrice: makeOffer.totalPrice ?? "",
//           expirationTimestamp: makeOffer.expirationTimestamp,
//         },
//       });

//       const transactionReceipt = await sendAndConfirmTransaction({
//         transaction,
//         account: activeAccount,
//       });

//       if (transactionReceipt.status === "reverted") {
//         throw new Error("Transaction failed");
//       }

//       return transactionReceipt;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["offer", "nft", activeAccount?.address],
//       });
//     },
//     onError: () => {},
//     meta: {
//       successMessage: {
//         description: "Offer made successfully",
//       },
//       errorMessage: {
//         description: "Failed to make offer",
//       },
//     },
//   });
// }

export function useAcceptOfferMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: string }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getAcceptOffer({
        offerId: offerId,
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listing.completed, queryKeys.nft.single],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.OFFER_ACCEPTED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.OFFER_ACCEPTED_ERROR,
      },
    },
  });
}

export function useCancelOfferMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ offerId }: { offerId: string }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getCancelOffer({
        offerId: offerId,
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listing.single, queryKeys.nft.single],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.OFFER_CANCELLED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.OFFER_CANCELLED_ERROR,
      },
    },
  });
}

export function useBidInAuctionMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      auctionId,
      bidAmount,
    }: {
      auctionId: string;
      bidAmount: string;
    }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getBidInAuction({
        auctionId: auctionId,
        bidAmount: bidAmount,
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.auction.newBids, queryKeys.nft.single],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.BID_PLACED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.BID_PLACED_ERROR,
      },
    },
  });
}

export function useCollectAuctionPayoutMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getCollectAuctionPayout({
        auctionId: auctionId,
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.nft.single],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.AUCTION_PAYOUT_COLLECTED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.AUCTION_PAYOUT_COLLECTED_ERROR,
      },
    },
  });
}

export function useCollectAuctionTokensMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getCollectAuctionTokens({
        auctionId: auctionId,
      });

      const transactionReceipt = await sendAndConfirmTransaction({
        transaction,
        account: activeAccount,
      });

      if (transactionReceipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return transactionReceipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.auction.newBids, queryKeys.nft.single],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.AUCTION_TOKENS_COLLECTED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.AUCTION_TOKENS_COLLECTED_ERROR,
      },
    },
  });
}
