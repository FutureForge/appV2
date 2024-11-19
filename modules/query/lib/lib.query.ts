import { useQuery } from "@tanstack/react-query";
import { useUserChainInfo } from "..";
import { getCheckApprovedForAll, getCheckApprovedPerTokenId } from "@/modules/blockchain/global/global.blockchain";

export function useCheckApprovedForAllQuery({
  collectionContractAddress,
}: {
  collectionContractAddress: string;
}) {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["approval", collectionContractAddress, activeAccount?.address],
    queryFn: async () => {
      if (!activeAccount?.address) return false;

      const isApproved = await getCheckApprovedForAll({
        contractAddress: collectionContractAddress,
        walletAddress: activeAccount?.address,
      });

      return isApproved;
    },
    enabled: !!activeAccount && !!collectionContractAddress,
    refetchInterval: 60000,
  });
}

export function useCheckApprovedForTokenIdQuery({
  collectionContractAddress,
  tokenId,
}: {
  collectionContractAddress: string;
  tokenId: string;
}) {
  const { activeAccount } = useUserChainInfo();

  return useQuery({
    queryKey: ["approval", collectionContractAddress, activeAccount?.address],
    queryFn: async () => {
      if (!activeAccount?.address) return false;

      const isApproved = await getCheckApprovedPerTokenId({
        contractAddress: collectionContractAddress,
        tokenId,
      });

      return isApproved;
    },
    enabled: !!activeAccount && !!collectionContractAddress && !!tokenId,
    refetchInterval: 60000,
  });
}

export function useCheckApprovalStatusQuery({
  collectionContractAddress,
  tokenId,
}: {
  collectionContractAddress: string;
  tokenId: string;
}) {
  const { data: isApprovedForAll } = useCheckApprovedForAllQuery({
    collectionContractAddress,
  });

  const { data: isApprovedForTokenId } = useCheckApprovedForTokenIdQuery({
    collectionContractAddress,
    tokenId,
  });

  const isApproved = Boolean(isApprovedForAll) || Boolean(isApprovedForTokenId);

  return isApproved;
}
