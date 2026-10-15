import { useToast } from "@/modules/app/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MARKETPLACE_ADDRESS_TESTNET,
  USDT_TOKEN_CONTRACT,
} from "@/utils/configs";
import USDTAbi from "@/utils/abi/usdt.json";
import { useUserChainInfo } from "@/modules/query";
import {
  getContractEthers,
  waitForTransaction,
} from "../../blockchain";
import { MessagesEnum } from "../../../utils/enums/messages/messages.enum";

export function useIncreaseUSDTAllowanceMutation() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const USDTContract = await getContractEthers({
        contractAddress: USDT_TOKEN_CONTRACT,
        abi: USDTAbi,
      });

      const approvalTxData = await USDTContract.populateTransaction.approve(
        MARKETPLACE_ADDRESS_TESTNET,
        amount
      );
      // @ts-ignore
      const tx = await activeAccount.sendTransaction(approvalTxData);
      const receipt = await waitForTransaction(tx.transactionHash);

      if (receipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["usdt", "make-offer", activeAccount?.address],
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
