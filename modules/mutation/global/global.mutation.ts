import { getSetApprovalForAll } from "@/modules/blockchain/global/global.blockchain";
import { useUserChainInfo } from "@/modules/query";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
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
          "approval",
          collectionContractAddress,
          activeAccount?.address,
        ],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.APPROVAL_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.APPROVAL_ERROR,
      },
    },
  });
}
