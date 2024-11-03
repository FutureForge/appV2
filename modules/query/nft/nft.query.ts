import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { CROSSFI_API_TESTNET, MARKETPLACE_ADDRESS } from "@/utils/configs";
import { getPlatformFeeInfoCustom } from "@/modules/blockchain/global/global.blockchain";
import { getNFT } from "thirdweb/extensions/erc721";
import { getContractCustom } from "@/modules/blockchain";
import ERC721ABI from "@/utils/abi/erc721.json";
import { NFT } from "thirdweb";
import { tryParseJSON } from "@/utils/functions";
import {
  useSingleAuctionQuery,
  useSingleListingQuery,
  useSingleOfferQuery,
} from "..";
import { NFTActivityResponse } from "@/utils/types/global";

export function useSingleNFTQuery({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {

  const { data: singleListing } = useSingleListingQuery({
    contractAddress,
    tokenId,
  });

  const { data: singleAuction } = useSingleAuctionQuery({
    contractAddress,
    tokenId,
  });

  const { data: singleOffer } = useSingleOfferQuery({
    contractAddress,
    tokenId,
  });

  console.log({ singleListing, singleAuction, singleOffer });

  return useQuery({
    queryKey: [queryKeys.nft.single, contractAddress, tokenId],
    queryFn: async () => {
      const [tokenTransfersResponse, collectionFee, marketplaceFee] =
        await Promise.all([
          axios.get<NFTActivityResponse>(
            `${CROSSFI_API_TESTNET}/token-transfers?contractAddress=${contractAddress}&tokenId=${tokenId}&tokenType=CFC-721&page=1&limit=100&sort=-blockNumber`
          ),
          getPlatformFeeInfoCustom({ contractAddress }).catch(() => ({})),
          getPlatformFeeInfoCustom({
            contractAddress: MARKETPLACE_ADDRESS,
          }).catch(() => ({})),
        ]);

      const nftActivity = tokenTransfersResponse.data.docs;

      const contract = getContractCustom({
        contractAddress,
        abi: ERC721ABI,
      });

      let updatedNFT: NFT | null = null;

      const nft = await getNFT({
        contract,
        tokenId: BigInt(tokenId),
        includeOwner: true,
      });

      const uri = nft.tokenURI;
      const parsedMetadata = typeof uri === "string" ? tryParseJSON(uri) : uri;

      if (parsedMetadata && typeof parsedMetadata === "object") {
        updatedNFT = {
          ...nft,
          tokenURI: parsedMetadata.image,
          metadata: {
            ...parsedMetadata,
          },
        };
      } else {
        updatedNFT = nft;
      }

      const activeType =
        singleListing?.length! > 0
          ? "listing"
          : singleAuction?.length! > 0
          ? "auction"
          : singleOffer?.length! > 0
          ? "offer"
          : "none";

      return {
        collectionFee,
        marketplaceFee,
        nftActivity,
        nft: updatedNFT,
        activeType,
        offers: singleOffer,
      };
    },
    refetchInterval: 5000,
  });
}
