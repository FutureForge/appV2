import { useQuery } from "@tanstack/react-query";
import { useUserChainInfo } from "..";
import { getCheckApprovedForAll } from "@/modules/blockchain/global/global.blockchain";

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
