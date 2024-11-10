import { upload } from "thirdweb/storage";
import { useToast } from "@/modules/app/hooks/useToast";
import { getContractEthers, waitForTransaction } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { client, MARKETPLACE_ADDRESS_TESTNET } from "@/utils/configs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import MinterABI from "@/utils/abi/erc721.json";
import { queryKeys } from "@/modules/query/query-keys";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";

type CreateNFTMetadata = {
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
      //   if (!activeAccount) return toast.error("Please connect your wallet");

      //   const minterContract = await getContractEthers({
      //     contractAddress: MARKETPLACE_ADDRESS_TESTNET,
      //     abi: MinterABI,
      //   });

      console.log({ createNFTData });

      const uri = await upload({
        client,
        files: [createNFTData.file],
        uploadWithoutDirectory: true,
        // metadata: {
        //   name: createNFTData.name, metadata?: Record<string, string>; 
        //   description: createNFTData.description, {uri: 'ipfs://QmeWaoYTdtAETwfgJQm41cPi2KewxoeeNWfAEXDPcvHpV9'}  QmWoUSpWQnQJFnGyiQvohobaR589pPMZz3UYVyahhTV16Z
        // },
      });

      console.log({ uri });
      console.log({ createNFTData });

      if (uri) {
        // const tokenURI = JSON.stringify({
        //   name: createNFTData.name,
        //   description: createNFTData.description,
        //   image: uri,
        //   attributes: createNFTData.attributes,
        // });

        const metadata = {
          name: createNFTData.name,
          description: createNFTData.description,
          image: uri,
          attributes: createNFTData.attributes,
        };

        const metadataURI = await upload({
          client,
          files: [
            {
              name: `${createNFTData.name}-${Math.random()}.json`,
              data: JSON.stringify(metadata),
            },
          ],
          uploadWithoutDirectory: true,
        });

        console.log({ metadataURI });

        // const transaction = await minterContract.populateTransaction.mint(
        //   tokenURI,
        //   {
        //     value: ethers.utils.parseEther("1"), // update this to the mint price directly from the contract
        //   }
        // );

        // // @ts-ignore
        // const tx = await activeAccount.sendTransaction(transaction);
        // const receipt = await waitForTransaction(tx.transactionHash);

        // if (receipt.status === "reverted") {
        //   throw new Error("Transaction failed");
        // }

        // const totalSupply = await minterContract.totalSupply();
        // const tokenId = totalSupply.toString() - 1;

        // await router.push(`/nft/${CROSSFI_MINTER_ADDRESS}/CFC-721/${tokenId}`);

        // return receipt;
        return uri;
      } else {
        throw new Error("No URI");
      }
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
