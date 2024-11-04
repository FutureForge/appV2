import { MARKETPLACE_ADDRESS_TESTNET, nativeCurrency } from "@/utils/configs";
import { getEndBlockchainTimestamp } from "@/utils/functions";
import { getContractCustom } from "..";
import { prepareContractCall, toWei } from "thirdweb";
import { MakeOfferListingType } from "@/utils/types/blockchain/blockchain.type";

export async function getMakeOffer({
  params: _params,
}: {
  params: MakeOfferListingType;
}) {
  const expirationTimestamp = getEndBlockchainTimestamp(
    _params.expirationTimestamp
  );
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency || nativeCurrency,
    totalPrice: toWei(_params.totalPrice),
    expirationTimestamp,
  };

  const transaction = await prepareContractCall({
    contract,
    method:
      "function makeOffer((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 totalPrice, uint256 expirationTimestamp) _params) returns (uint256 _offerId)",
    params: [formattedParams],
    // value: toWei(_params.totalPrice)
  });

  return transaction;
}

export async function getAcceptOffer({ offerId }: { offerId: string }) {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function acceptOffer(uint256 _offerId)",
    params: [BigInt(offerId)],
  });

  return transaction;
}

export async function getCancelOffer({ offerId }: { offerId: string }) {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function cancelOffer(uint256 _offerId)",
    params: [BigInt(offerId)],
  });

  return transaction;
}

export async function getCollectAuctionPayout({
  auctionId,
}: {
  auctionId: string;
}) {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function collectAuctionPayout(uint256 _auctionId)",
    params: [BigInt(auctionId)],
  });

  return transaction;
}

export async function getCollectAuctionTokens({
  auctionId,
}: {
  auctionId: string;
}) {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function collectAuctionTokens(uint256 _auctionId)",
    params: [BigInt(auctionId)],
  });

  return transaction;
}
