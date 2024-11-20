import { useToast } from "@/modules/app/hooks/useToast";
import {
  decimalOnChain,
  getBidInAuction,
  getCollectAuctionPayout,
  getCollectAuctionTokens,
  getContractEthers,
} from "@/modules/blockchain";
import {
  getAcceptOffer,
  getCancelOffer,
  getMakeOffer,
} from "@/modules/blockchain/offer/offer.blockchain";
import { useUserChainInfo } from "@/modules/query";
import { queryKeys } from "@/modules/query/query-keys";
import {
  MARKETPLACE_ADDRESS_TESTNET,
  WRAPPED_TOKEN_CONTRACT,
} from "@/utils/configs";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import { MakeOfferListingType } from "@/utils/types/blockchain/blockchain.type";
import {
  useConvertXFIToWXFIMutation,
  useIncreaseAllowanceMutation,
} from "@/wxfi.mutation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { sendAndConfirmTransaction } from "thirdweb";
import WXFIAbi from "@/utils/abi/wxfi.json";

export function useMakeListingOfferMutation() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();
  const increaseAllowanceMutation = useIncreaseAllowanceMutation();
  const convertXFIToWXFIMutation = useConvertXFIToWXFIMutation();

  return useMutation({
    mutationFn: async ({ makeOffer }: { makeOffer: MakeOfferListingType }) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const WXFIContract = await getContractEthers({
        contractAddress: WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      });

      const makeOfferValue = decimalOnChain(makeOffer.totalPrice);
      const wxfiBalanceRaw = await WXFIContract.balanceOf(
        activeAccount.address
      );

      // Step 1: Convert XFI to WXFI if needed
      if (BigNumber.from(wxfiBalanceRaw).lt(makeOfferValue!)) {
        await toast.loading("Wrapping XFI to WXFI");
        await convertXFIToWXFIMutation.mutateAsync({
          amount: makeOffer.totalPrice!,
        });

        const updatedWxfiBalance = await WXFIContract.balanceOf(
          activeAccount.address
        );
        if (BigNumber.from(updatedWxfiBalance).lt(makeOfferValue!)) {
          throw new Error("Insufficient WXFI balance after conversion");
        }
      }

      // Step 2: Increase allowance if needed
      const currentAllowance = await WXFIContract.allowance(
        activeAccount?.address,
        MARKETPLACE_ADDRESS_TESTNET
      );
      if (BigNumber.from(currentAllowance).lt(makeOfferValue!)) {
        await toast.loading("Approving WXFI to spend");
        await increaseAllowanceMutation.mutateAsync({
          amount: makeOfferValue!.toString(),
        });

        const updatedAllowance = await WXFIContract.allowance(
          activeAccount?.address,
          MARKETPLACE_ADDRESS_TESTNET
        );
        if (BigNumber.from(updatedAllowance).lt(makeOfferValue!)) {
          throw new Error("Insufficient allowance after approval");
        }
      }

      const transaction = await getMakeOffer({
        params: {
          assetContract: makeOffer.assetContract,
          tokenId: makeOffer.tokenId,
          quantity: makeOffer.quantity,
          currency: makeOffer.currency,
          totalPrice: makeOffer.totalPrice,
          expirationTimestamp: makeOffer.expirationTimestamp,
        },
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
        queryKey: [
          activeAccount?.address,
          queryKeys.offers.all,
          queryKeys.nft.single,
          queryKeys.offers.single,
        ],
        refetchType: "all",
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.OFFER_MADE_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.OFFER_MADE_ERROR,
      },
    },
  });
}

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
        queryKey: [
          queryKeys.listing.completed,
          queryKeys.nft.single,
          queryKeys.offers.all,
        ],
        refetchType: "all",
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
        queryKey: [
          queryKeys.listing.completed,
          queryKeys.nft.single,
          queryKeys.offers.all,
        ],
        refetchType: "all",
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
        queryKey: [
          queryKeys.auction.newBids,
          queryKeys.auction.all,
          queryKeys.nft.single,
          queryKeys.user.all,
        ],
        refetchType: "all",
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
        queryKey: [
          queryKeys.auction.newBids,
          queryKeys.auction.all,
          queryKeys.nft.single,
          queryKeys.user.all,
        ],
        refetchType: "all",
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
        queryKey: [
          queryKeys.auction.newBids,
          queryKeys.auction.all,
          queryKeys.nft.single,
          queryKeys.user.all,
          queryKeys.auction.newBidsUser,
          queryKeys.auction.newBids,
        ],
        refetchType: "all",
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
