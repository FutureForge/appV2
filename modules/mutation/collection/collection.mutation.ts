import { getContractCustom } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { queryKeys } from "@/modules/query/query-keys";
import { MessagesEnum } from "@/utils/enums/messages/messages.enum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { owner } from "thirdweb/extensions/common";
import axios from "axios";
import { backendURL } from "@/utils/configs";

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

      const contract = await getContractCustom({ contractAddress });
      const contractOwner = await owner({ contract });

      if (contractOwner.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error("User is not the owner of the contract");
      }

      const signMessage = `I am the owner of the contract ${contractAddress} and want to add a new collection. Sign this message to confirm`;

      await activeAccount?.signMessage({ message: signMessage });

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

      if (response.status === 200) {
        router.push(`/collections/${contractAddress}`);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        refetchType: "all"
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
      collectionId: number;
      contractAddress: string;
      name: string;
      description: string;
      image: File | null;
      backgroundImage: File | null;
      collectionSocials: { socialName: string; socialLink: string }[];
    }) => {
      if (!userAddress) {
        throw new Error("User not connected");
      }

      const contract = await getContractCustom({ contractAddress });
      const contractOwner = await owner({ contract });

      if (contractOwner.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error("User is not the owner of the contract");
      }

      const signMessage = `I am the owner of the contract ${contractAddress} and want to update this collection. Sign this message to confirm the update`;

      await activeAccount?.signMessage({ message: signMessage });

      const formData = new FormData();
      formData.append("collectionName", name);
      formData.append("collectionDescription", description);
      if (image) {
        formData.append("collectionImage", image);
      }
      if (backgroundImage) {
        formData.append("collectionBackgroundImage", backgroundImage);
      }
      formData.append("collectionSocials", JSON.stringify(collectionSocials));

      const response = await axios.patch(
        `${backendURL}/collection/${collectionId}`,
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
        refetchType: "all"
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
