import { MARKETPLACE_ADDRESS_TESTNET, nativeCurrency } from "@/utils/configs";
import {
  getCurrentBlockchainTimestamp,
  getEndBlockchainTimestamp,
} from "@/utils/functions";
import { getContractCustom } from "..";
import { CreateAuctionType } from "@/utils/types/blockchain";
import { prepareContractCall, toWei } from "thirdweb";

export async function getCreateAuction({
  params: _params,
}: {
  params: CreateAuctionType;
}) {
  const startTimestamp = getCurrentBlockchainTimestamp();
  const endTimestamp = getEndBlockchainTimestamp(_params.endTimestamp);

  const contract = getContractCustom({ contractAddress: MARKETPLACE_ADDRESS_TESTNET });

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency || nativeCurrency,
    minimumBidAmount: toWei(_params.minimumBidAmount),
    buyoutBidAmount: toWei(_params.buyoutBidAmount),
    timeBufferInSeconds: BigInt(_params.timeBufferInSeconds || 60 * 5),
    bidBufferBps: BigInt(_params.bidBufferBps || 5),
    startTimestamp,
    endTimestamp,
  };

  const transaction = await prepareContractCall({
    contract,
    method:
      "function createAuction((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 minimumBidAmount, uint256 buyoutBidAmount, uint64 timeBufferInSeconds, uint64 bidBufferBps, uint64 startTimestamp, uint64 endTimestamp) _params) returns (uint256 auctionId)",
    params: [formattedParams],
  });

  return transaction;
}
