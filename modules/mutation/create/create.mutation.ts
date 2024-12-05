import { upload } from "thirdweb/storage";
import { useToast } from "@/modules/app/hooks/useToast";
import { getContractEthers, waitForTransaction } from "@/modules/blockchain";
import {
  useCreationFeeQuery,
  useMintFeeQuery,
  useUserChainInfo,
} from "@/modules/query";
import { client, NFT_FACTORY_ADDRESS } from "@/utils/configs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/modules/query/query-keys";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import nftFactoryABI from "@/utils/abi/nftFactory.json";
import nftBaseABI from "@/utils/abi/nftBase.json";

type CreateNFTMetadata = {
  contractAddress: string;
  name: string;
  description: string;
  file: File;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
};

// https://2551fcbc3ba71a7d708b7442aeb628f9.ipfscdn.io/ipfs/id

export function useCreateNFTMutation() {
  const toast = useToast();
  const router = useRouter();

  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  const { data: mintFee } = useMintFeeQuery();

  return useMutation({
    mutationFn: async (createNFTData: CreateNFTMetadata) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const NFTBaseContract = getContractEthers({
        contractAddress: createNFTData.contractAddress,
        abi: nftBaseABI,
      });

      if (!NFTBaseContract) throw new Error("No file");

      return { receipt: { transactionHash: "12345" }, tokenId: 1 };

      // upload file to ipfs
      // const uri = await upload({
      //   client,
      //   files: [createNFTData.file],
      //   uploadWithoutDirectory: true,
      // });

      // if (uri) {
      //   // create metadata and upload to ipfs
      //   const metadata = {
      //     name: createNFTData.name,
      //     description: createNFTData.description,
      //     image: uri,
      //     attributes: createNFTData.attributes,
      //   };

      //   const metadataURI = await upload({
      //     client,
      //     files: [
      //       {
      //         name: `${createNFTData.name}-${Math.random()}.json`,
      //         data: JSON.stringify(metadata),
      //       },
      //     ],
      //     uploadWithoutDirectory: true,
      //   });

      //   if (!metadataURI) throw new Error("No metadata URI");

      //   const userAddress = activeAccount.address;

      //   const transaction = await NFTBaseContract.populateTransaction.safeMint(
      //     userAddress,
      //     metadataURI,
      //     {
      //       value: ethers.utils.parseEther(mintFee),
      //     }
      //   );

      //   // @ts-ignore
      //   const tx = await activeAccount.sendTransaction(transaction);
      //   const receipt = await waitForTransaction(tx.transactionHash);

      //   if (receipt.status === "reverted") {
      //     throw new Error("Transaction failed");
      //   }

      //   const userBalance = await NFTBaseContract.balanceOf(userAddress);
      //   const tokenId = Number(userBalance.toString()) - 1;

      //   // await router.push(`/nft/${createNFTData.contractAddress}/${tokenId}`);

      //   return { receipt, tokenId };
      // } else {
      //   throw new Error("No URI");
      // }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.user.createNFT, queryKeys.user.nfts],
      });
    },
    onError: (error, variables, context) => {},
    meta: {
      successMessage: {
        description: MessagesEnum.NFT_MINTED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.NFT_MINTED_ERROR,
      },
    },
  });
}

export function useCreateNFTContractMutation() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  const { data: creationFee } = useCreationFeeQuery();

  const NFTFactoryContract = getContractEthers({
    contractAddress: NFT_FACTORY_ADDRESS,
    abi: nftFactoryABI,
  });

  return useMutation({
    mutationFn: async ({ name, symbol }: { name: string; symbol: string }) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const transaction =
        await NFTFactoryContract.populateTransaction.createNFTContract(
          name,
          symbol,
          {
            value: ethers.utils.parseEther(creationFee),
          }
        );

      // @ts-ignore
      const tx = await activeAccount.sendTransaction(transaction);
      const receipt = await waitForTransaction(tx.transactionHash);

      return receipt;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.user.nftContracts],
      });
    },
    meta: {
      successMessage: {
        description: MessagesEnum.NFT_CONTRACT_CREATED_SUCCESS,
      },
      errorMessage: {
        description: MessagesEnum.NFT_CONTRACT_CREATED_ERROR,
      },
    },
  });
}
