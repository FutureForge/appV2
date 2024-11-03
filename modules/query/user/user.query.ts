import { useQuery } from "@tanstack/react-query";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { queryKeys } from "../query-keys";
import axios from "axios";
import { CROSSFI_API_TESTNET } from "@/utils/configs";
import { UserNFTResponse } from "@/utils/types/global";
import { useFilteredAllListingsQuery } from "..";
import { getContractCustom } from "@/modules/blockchain";
import { getNFT } from "thirdweb/extensions/erc721";
import { ensureSerializable, tryParseJSON } from "@/utils/functions";

export function useUserChainInfo() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  return { activeAccount, activeWallet };
}

export function useUserNFTsQuery() {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { data: userListedNFTs } = useFilteredAllListingsQuery({
    address: userAddress?.toLowerCase() || "",
  });

  return useQuery({
    queryKey: [queryKeys.user.nfts],
    queryFn: async () => {
      const response = await axios.get<UserNFTResponse>(
        `${CROSSFI_API_TESTNET}/token-holders?address=${userAddress}&tokenType=CFC-721&page=1&limit=1000&sort=-balance`
      );

      const userNFTs = response.data.docs;

      const updatedNFTs = await Promise.all(
        userNFTs.map(async (nfts) => {
          const { tokenIds, contractAddress } = nfts;

          const uniqueTokenIds = Array.from(new Set(tokenIds));

          const tokenIdNFTs = await Promise.all(
            uniqueTokenIds.map(async (ids) => {
              const contract = getContractCustom({
                contractAddress: contractAddress,
              });

              const nft = await getNFT({
                contract: contract,
                tokenId: BigInt(ids),
                includeOwner: true,
              });

              let updatedNFT = nft;

              const uri = nft.tokenURI;
              const parsedMetadata =
                typeof uri === "string" ? tryParseJSON(uri) : uri;

              if (parsedMetadata && typeof parsedMetadata === "object") {
                updatedNFT = {
                  ...nft,
                  tokenURI: parsedMetadata.image,
                  metadata: {
                    ...parsedMetadata,
                  },
                };
              }

              return {
                ...nfts,
                nft: updatedNFT,
                type: "NFTs",
                tokenId: nft.id.toString(),
              };
            })
          );

          return tokenIdNFTs;
        })
      );

      const flatNFTs = updatedNFTs.flat();

      const userNFTsNotListed = flatNFTs?.filter((nft: any) => {
        const nftTokenId = nft.tokenId;

        return !userListedNFTs?.some(
          (listing) =>
            listing.assetContract.toLowerCase() ===
              nft.contractAddress.toLowerCase() &&
            listing.tokenId.toString() === nftTokenId
        );
      });

      return ensureSerializable(userNFTsNotListed);
    },
    enabled: !!userAddress,
    refetchInterval: 1000000,
  });
}
