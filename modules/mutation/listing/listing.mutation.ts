import {
  getBuyFromDirectListing,
  getCancelDirectListing,
  getCreateDirectListing,
  getUpdateDirectListing,
} from "@/modules/blockchain/listing/listing.blockchain";
import { useUserChainInfo } from "@/modules/query";
import { queryKeys } from "@/modules/query/query-keys";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import {
  BuyFromDirectListingType,
  CreateDirectListingType,
} from "@/utils/types/blockchain/blockchain.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "thirdweb";

/**
 * NEEDED VALUES
 * tokenId
 * assetContract
 * pricePerToken
 * endTimestamp
 */

export function useCreateListingMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      directListing,
    }: {
      directListing: CreateDirectListingType;
    }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      console.log({ directListing });

      const transaction = await getCreateDirectListing({
        params: {
          assetContract: directListing.assetContract,
          tokenId: directListing.tokenId,
          pricePerToken: directListing.pricePerToken,
          endTimestamp: directListing.endTimestamp,
        },
      });

      console.log({ transaction });

      if (!transaction) throw new Error("Failed to create listing");

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
        queryKey: [queryKeys.listing.new, queryKeys.listing.newFiltered],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.LISTING_CREATED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.LISTING_CREATED_ERROR,
      },
    },
  });
}

export function useUpdateListingMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      listingId,
      directListing,
    }: {
      listingId: string;
      directListing: Partial<CreateDirectListingType>;
    }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getUpdateDirectListing({
        listingId,
        params: {
          assetContract: directListing.assetContract ?? "",
          tokenId: directListing.tokenId ?? "",
          quantity: directListing.quantity ?? "",
          pricePerToken: directListing.pricePerToken ?? "",
          endTimestamp:
            directListing.endTimestamp ??
            new Date(Date.now() + 1000 * 60 * 60 * 24),
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
        queryKey: [queryKeys.nft.single],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.LISTING_UPDATED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.LISTING_UPDATED_ERROR,
      },
    },
  });
}

export function useCancelDirectListingMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ listingId }: { listingId: string }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getCancelDirectListing({
        listingId,
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
        description: MessagesEnum.CANCEL_LISTING_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.CANCEL_LISTING_ERROR,
      },
    },
  });
}

export function useBuyFromDirectListingMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      buyFromListing,
    }: {
      buyFromListing: BuyFromDirectListingType;
    }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getBuyFromDirectListing({
        params: {
          buyFor: buyFromListing.buyFor || activeAccount.address,
          currency: buyFromListing.currency ?? "",
          listingId: buyFromListing.listingId ?? "",
          quantity: buyFromListing.quantity ?? "",
          nativeTokenValue: buyFromListing.nativeTokenValue ?? "",
          totalPrice: buyFromListing.totalPrice ?? "",
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
        queryKey: [queryKeys.listing.completed, queryKeys.nft.single],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.BUY_LISTING_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.BUY_LISTING_ERROR,
      },
    },
  });
}
