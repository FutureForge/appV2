import {
  getSetApprovalForAll,
  getSetApprovalForTokenId,
} from "@/modules/blockchain/global/global.blockchain";
import { useUserChainInfo } from "@/modules/query";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import {
  ApprovalSettingEnum,
  useApprovalSettingStore,
} from "@/utils/store/approval-settings.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendAndConfirmTransaction } from "thirdweb";

export function useApprovedForAllMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      collectionContractAddress,
    }: {
      collectionContractAddress: string;
    }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getSetApprovalForAll({
        contractAddress: collectionContractAddress,
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
    onSuccess: (_, { collectionContractAddress }) => {
      queryClient.invalidateQueries({
        queryKey: [
          "approval-all",
          collectionContractAddress,
          activeAccount?.address,
        ],
        refetchType: "all",
      });
    },
    onError: () => {},
    meta: {
      showLoading: false,
      successMessage: {
        description: MessagesEnum.APPROVAL_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.APPROVAL_ERROR,
      },
    },
  });
}

export function useApprovedForTokenIdMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({
      collectionContractAddress,
      tokenId,
    }: {
      collectionContractAddress: string;
      tokenId: string;
    }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      const transaction = await getSetApprovalForTokenId({
        contractAddress: collectionContractAddress,
        tokenId,
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
    onSuccess: (_, { collectionContractAddress }) => {
      queryClient.invalidateQueries({
        queryKey: [
          "approval-token-id",
          collectionContractAddress,
          activeAccount?.address,
        ],
        refetchType: "all",
      });
    },
    onError: () => {},
    meta: {
      showLoading: false,
      successMessage: {
        description: MessagesEnum.APPROVAL_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.APPROVAL_ERROR,
      },
    },
  });
}

export function useApprovalMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  const { approvalSetting } = useApprovalSettingStore();

  const approvalForAllMutation = useApprovedForAllMutation();
  const approvalTokenIdMutation = useApprovedForTokenIdMutation();

  return useMutation({
    mutationFn: async ({
      collectionContractAddress,
      tokenId,
    }: {
      collectionContractAddress: string;
      tokenId: string;
    }) => {
      if (!activeAccount) {
        throw new Error("Please connect your wallet");
      }

      let receipt;

      if (approvalSetting === ApprovalSettingEnum.UNLIMITED) {
        receipt = await approvalForAllMutation.mutateAsync({
          collectionContractAddress,
        });
      }

      if (approvalSetting === ApprovalSettingEnum.ONE_PER_ONE) {
        receipt = await approvalTokenIdMutation.mutateAsync({
          collectionContractAddress,
          tokenId,
        });
      }

      return receipt;
    },
    onSuccess: (_, { collectionContractAddress }) => {
      queryClient.invalidateQueries({
        queryKey: [
          "approval",
          collectionContractAddress,
          activeAccount?.address,
        ],
        refetchType: "all",
      });
    },
    onError: () => {},
    meta: {
      showLoading: false,
      successMessage: {
        description: MessagesEnum.APPROVAL_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.APPROVAL_ERROR,
      },
    },
  });
}
