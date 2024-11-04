import { getContractCustom } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { queryKeys } from "@/modules/query/query-keys";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { isERC721 } from "thirdweb/extensions/erc721";
import { owner } from "thirdweb/extensions/common";
import axios from "axios";
import { backendURL } from "@/utils/configs";

export async function isNFTContract(contractAddress: string) {
  const contract = await getContractCustom({ contractAddress });
  const result = await isERC721({ contract });
  return result;
}

export function useAddCollectionMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      contractAddress,
      name,
      description,
      image,
      backgroundImage,
      collectionSocials,
    }: {
      contractAddress: string;
      name: string;
      description: string;
      image: File;
      backgroundImage: File;
      collectionSocials: { socialName: string; socialLink: string }[];
    }) => {
      if (!userAddress) {
        throw new Error("User not connected");
      }

      //   const contract = await getContractCustom({ contractAddress });

      //   const contractOwner = await owner({ contract });

      //   if (contractOwner !== userAddress) {
      //     throw new Error("User is not the owner of the contract");
      //   }

      //   const signMessage = `I am the owner of the contract ${contractAddress} and want to add a new collection. Sign this message to confirm`;

      //   await activeAccount?.signMessage({ message: signMessage });

      const formData = new FormData();
      formData.append("collectionAddress", contractAddress.toLowerCase());
      formData.append("collectionName", name);
      formData.append("collectionDescription", description);
      formData.append("collectionImage", image);
      formData.append("collectionBackgroundImage", backgroundImage);
      formData.append("collectionOwnerAddress", userAddress.toLowerCase());
      formData.append("collectionSocials", JSON.stringify(collectionSocials));

      const response = await axios.post(
        `${backendURL}/collection/add-collection`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // TODO: Add router to push it to the new collection page

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.collection.all],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        title: "Success",
        description: MessagesEnum.COLLECTION_ADDED_SUCCESS,
      },
      errorMessage: {
        title: "Error",
        description: MessagesEnum.COLLECTION_ADDED_ERROR,
      },
    },
  });
}

export function useUpdateCollectionMutation() {
  const queryClient = useQueryClient();
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  return useMutation({
    mutationFn: async ({
      collectionId,
      contractAddress,
      name,
      description,
      image,
      backgroundImage,
      collectionSocials,
    }: {
      collectionId: string;
      contractAddress: string;
      name: string;
      description: string;
      image: File;
      backgroundImage: File;
      collectionSocials: { socialName: string; socialLink: string }[];
    }) => {
      if (!userAddress) {
        throw new Error("User not connected");
      }

      const contract = await getContractCustom({ contractAddress });
      const contractOwner = await owner({ contract });

      if (contractOwner !== userAddress) {
        throw new Error("User is not the owner of the contract");
      }

      const signMessage = `I am the owner of the contract ${contractAddress} and want to update this collection. Sign this message to confirm the update`;

      await activeAccount?.signMessage({ message: signMessage });

      const formData = new FormData();
      formData.append("collectionAddress", contractAddress.toLowerCase());
      formData.append("collectionName", name);
      formData.append("collectionDescription", description);
      formData.append("collectionImage", image);
      formData.append("collectionBackgroundImage", backgroundImage);
      formData.append("collectionOwnerAddress", userAddress.toLowerCase());
      formData.append("collectionSocials", JSON.stringify(collectionSocials));

      const response = await axios.put(
        `${backendURL}/collection/update-collection/${collectionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.collection.single],
      });
    },
    onError: () => {},
    meta: {
      successMessage: {
        title: "Success",
        description: MessagesEnum.COLLECTION_UPDATED_SUCCESS,
      },
      errorMessage: {
        title: "Error",
        description: MessagesEnum.COLLECTION_UPDATED_ERROR,
      },
    },
  });
}
