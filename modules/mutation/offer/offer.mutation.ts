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
  USDT_TOKEN_CONTRACT,
} from "@/utils/configs";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import { MakeOfferListingType } from "@/utils/types/blockchain/blockchain.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { sendAndConfirmTransaction } from "thirdweb";
import USDTAbi from "@/utils/abi/usdt.json";
import { useIncreaseUSDTAllowanceMutation } from "../usdt/usdt.mutation";

export function useMakeListingOfferMutation() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();
  const increaseAllowanceMutation = useIncreaseUSDTAllowanceMutation();

  return useMutation({
    mutationFn: async ({ makeOffer }: { makeOffer: MakeOfferListingType }) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const USDTContract = await getContractEthers({
        contractAddress: USDT_TOKEN_CONTRACT,
        abi: USDTAbi,
      });

      const makeOfferValue = decimalOnChain(makeOffer.totalPrice);
      const usdtBalanceRaw = await USDTContract.balanceOf(activeAccount.address);

      if (BigNumber.from(usdtBalanceRaw).lt(makeOfferValue!)) {
        throw new Error("Insufficient USDT balance");
      }

      // Increase allowance if needed
      const currentAllowance = await USDTContract.allowance(
        activeAccount?.address,
        MARKETPLACE_ADDRESS_TESTNET
      );
      if (BigNumber.from(currentAllowance).lt(makeOfferValue!)) {
        await toast.loading("Approving USDT to spend");
        await increaseAllowanceMutation.mutateAsync({
          amount: makeOfferValue!.toString(),
        });

        const updatedAllowance = await USDTContract.allowance(
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
          queryKeys.nft.single,
          queryKeys.user.nfts,
          queryKeys.user.listings,
          queryKeys.listing.filtered,
          queryKeys.listing.blockchain,
          queryKeys.listing.userBlockchain,
          queryKeys.events.newOffer,
        ],
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
          queryKeys.nft.single,
          queryKeys.user.nfts,
          queryKeys.user.offers,
          queryKeys.offers.filtered,
          queryKeys.offers.blockchain,
          queryKeys.offers.userBlockchain,
          queryKeys.events.acceptedOffer,
        ],
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
          queryKeys.nft.single,
          queryKeys.user.nfts,
          queryKeys.user.offers,
          queryKeys.offers.filtered,
          queryKeys.offers.blockchain,
          queryKeys.offers.userBlockchain,
          queryKeys.events.newOffer,
        ],
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
          queryKeys.nft.single,
          queryKeys.user.nfts,
          queryKeys.user.auctions,
          queryKeys.auction.filtered,
          queryKeys.auction.blockchain,
          queryKeys.auction.userBlockchain,
          queryKeys.events.auctionBid,
        ],
      });
      // queryClient.invalidateQueries({
      //   refetchType: "all",
      // });
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
          queryKeys.user.nfts,
          queryKeys.nft.single,
          queryKeys.user.auctions,
          queryKeys.auction.filtered,
          queryKeys.auction.blockchain,
          queryKeys.auction.userBlockchain,
          queryKeys.events.completedAuction,
        ],
      });
      // queryClient.invalidateQueries({
      //   refetchType: "all",
      // });
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
          queryKeys.nft.single,
          queryKeys.user.nfts,
          queryKeys.user.auctions,
          queryKeys.auction.filtered,
          queryKeys.auction.blockchain,
          queryKeys.auction.userBlockchain,
          queryKeys.events.completedAuction,
        ],
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
