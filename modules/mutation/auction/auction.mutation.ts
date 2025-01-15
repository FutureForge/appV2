import { getCancelAuction, getCreateAuction } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { queryKeys } from "@/modules/query/query-keys";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import { CreateAuctionType } from "@/utils/types/blockchain/blockchain.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "thirdweb";

export function useCreateAuctionMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      auctionDetails,
    }: {
      auctionDetails: CreateAuctionType;
    }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getCreateAuction({
        params: {
          assetContract: auctionDetails.assetContract ?? "",
          tokenId: auctionDetails.tokenId ?? "",
          quantity: auctionDetails.quantity ?? "1",
          bidBufferBps: auctionDetails.bidBufferBps ?? "",
          buyoutBidAmount: auctionDetails.buyoutBidAmount ?? "",
          minimumBidAmount: auctionDetails.minimumBidAmount ?? "",
          timeBufferInSeconds: auctionDetails.timeBufferInSeconds ?? "",
          startTimestamp: auctionDetails.startTimestamp ?? "",
          endTimestamp: auctionDetails.endTimestamp,
          currency: auctionDetails.currency ?? "",
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
          queryKeys.user.nfts,
          queryKeys.user.auctions,
          queryKeys.nft.single,
          queryKeys.collection.single,
          queryKeys.auction.blockchain,
          queryKeys.auction.userBlockchain,
          queryKeys.auction.filtered,
          queryKeys.user.auctions,
        ],
      });
    },
    onError: (error, variables, context) => {},
    meta: {
      successMessage: {
        description: MessagesEnum.AUCTION_CREATED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.AUCTION_CREATED_ERROR,
      },
    },
  });
}

export function useCancelAuctionMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getCancelAuction({
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
          queryKeys.user.auctions,
          queryKeys.nft.single,
          queryKeys.collection.single,
          queryKeys.auction.blockchain,
          queryKeys.auction.userBlockchain,
          queryKeys.auction.filtered,
        ],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.AUCTION_CANCELLED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.AUCTION_CANCELLED_ERROR,
      },
    },
  });
}
