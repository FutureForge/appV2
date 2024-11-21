import { upload } from "thirdweb/storage";
import { useToast } from "@/modules/app/hooks/useToast";
import {
  getContractCustom,
  getContractEthers,
  waitForTransaction,
} from "@/modules/blockchain";
import { useMintFeeQuery, useUserChainInfo } from "@/modules/query";
import {
  client,
  MARKETPLACE_ADDRESS_TESTNET,
  NFT_FACTORY_ADDRESS,
} from "@/utils/configs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/modules/query/query-keys";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import nftFactoryABI from "@/utils/abi/nftFactory.json";
import nftBaseABI from "@/utils/abi/nftBase.json";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";

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

  return useMutation({
    mutationFn: async (createNFTData: CreateNFTMetadata) => {
      if (!activeAccount) return toast.error("Please connect your wallet");

      const NFTBaseContract = getContractEthers({
        contractAddress: createNFTData.contractAddress,
        abi: nftBaseABI,
      });

      const NFTFactoryContract = getContractEthers({
        contractAddress: NFT_FACTORY_ADDRESS,
        abi: nftFactoryABI,
      });

      console.log({ NFTFactoryContract });

      // // upload file to ipfs
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

      //   console.log({ metadataURI });

      const metadataURI =
        "ipfs://QmciqcbPJqsj211nH9pZDr57w1zqqc7oUFQ8oEmeNY1WcV";

      console.log({ createNFTData });
      const contractAddress = createNFTData.contractAddress.toLowerCase();
      const userAddress = activeAccount.address;

      // const transaction = await NFTFactoryContract.populateTransaction.mintNFT(
      //   contractAddress,
      //   userAddress,
      //   metadataURI,
      // );

      // console.log({transaction})

     // // @ts-ignore
      // const tx = await activeAccount.sendTransaction(transaction);
      // const receipt = await waitForTransaction(tx.transactionHash);

      // if (receipt.status === "reverted") {
      //   throw new Error("Transaction failed");
      // }

      // const totalSupply = await NFTBaseContract.totalSupply();
      // const tokenId = totalSupply.toString() - 1;

      // console.log({ tokenId });
      // console.log({ totalSupply });

      // await router.push(`/nft/${createNFTData.contractAddress}/${tokenId}`);

      // return receipt;
      return null;
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
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();

  const { data: mintFee } = useMintFeeQuery();

  const NFTFactoryContract = getContractEthers({
    contractAddress: NFT_FACTORY_ADDRESS,
    abi: nftFactoryABI,
  });

  return useMutation({
    mutationFn: async ({
      name,
      symbol,
      initialSupply,
    }: {
      name: string;
      symbol: string;
      initialSupply: string;
    }) => {
      const transaction =
        await NFTFactoryContract.populateTransaction.createNFTContract(
          name,
          symbol,
          initialSupply,
          {
            value: ethers.utils.parseEther(mintFee),
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
