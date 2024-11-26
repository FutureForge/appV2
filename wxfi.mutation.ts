import { useToast } from "@/modules/app/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MARKETPLACE_ADDRESS_TESTNET,
  WRAPPED_TOKEN_CONTRACT,
} from "@/utils/configs";
import WXFIAbi from "@/utils/abi/wxfi.json";
import { useUserChainInfo } from "@/modules/query";
import { decimalOnChain, getContractEthers, waitForTransaction } from "./modules/blockchain";
import { MessagesEnum } from "./utils/enums/messages/messages.enum";

export function useIncreaseAllowanceMutation() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const WXFIContract = await getContractEthers({
        contractAddress: WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      });

      const approvalTxData = await WXFIContract.populateTransaction.approve(
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
        queryKey: ["wxfi", "make-offer", activeAccount?.address],
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

export function useConvertXFIToWXFIMutation() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const WXFIContract = await getContractEthers({
        contractAddress: WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      });

      const depositTxData = await WXFIContract.populateTransaction.deposit({
        value: decimalOnChain(amount),
      });

      // @ts-ignore
      const tx = await activeAccount.sendTransaction(depositTxData);
      const receipt = await waitForTransaction(tx.transactionHash);

      if (receipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "withdraw-wxfi",
          "balance",
          "convert-xfi-to-wxfi",
          "make-offer",
          activeAccount?.address,
        ],
      });
    },
    onError: () => {},
    meta: {
      showLoading: false,
      successMessage: {
        description: MessagesEnum.CONVERT_XFI_TO_WXFI_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.CONVERT_XFI_TO_WXFI_ERROR,
      },
    },
  });
}

export function useWithdrawWXFIMutation() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const WXFIContract = await getContractEthers({
        contractAddress: WRAPPED_TOKEN_CONTRACT,
        abi: WXFIAbi,
      });

      const withdraw = await WXFIContract.populateTransaction.withdraw(
        decimalOnChain(amount)
      );

      // @ts-ignore
      const tx = await activeAccount.sendTransaction(withdraw);
      const receipt = await waitForTransaction(tx.transactionHash);

      if (receipt.status === "reverted") {
        throw new Error("Transaction failed");
      }

      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "withdraw-wxfi",
          "balance",
          "convert-xfi-to-wxfi",
          activeAccount?.address,
        ],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        description: MessagesEnum.WITHDRAW_WXFI_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.WITHDRAW_WXFI_ERROR,
      },
    },
  });
}
