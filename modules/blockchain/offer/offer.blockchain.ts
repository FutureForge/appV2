import { MARKETPLACE_ADDRESS_TESTNET, nativeCurrency } from "@/utils/configs";
import { getEndBlockchainTimestamp } from "@/utils/functions";
import { getContractCustom } from "..";
import { prepareContractCall, readContract, toWei } from "thirdweb";
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

// export async function getCollectAuctionPayout({
//   auctionId,
// }: {
//   auctionId: string;
// }) {
//   const contract = getContractCustom({
//     contractAddress: MARKETPLACE_ADDRESS_TESTNET,
//   });

//   const transaction = await prepareContractCall({
//     contract,
//     method: "function collectAuctionPayout(uint256 _auctionId)",
//     params: [BigInt(auctionId)],
//   });

//   return transaction;
// }

// export async function getCollectAuctionTokens({
//   auctionId,
// }: {
//   auctionId: string;
// }) {
//   const contract = getContractCustom({
//     contractAddress: MARKETPLACE_ADDRESS_TESTNET,
//   });

//   const transaction = await prepareContractCall({
//     contract,
//     method: "function collectAuctionTokens(uint256 _auctionId)",
//     params: [BigInt(auctionId)],
//   });

//   return transaction;
// }

export async function getTotalOffers() {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });
  const totalOffers = await readContract({
    contract,
    method: "function totalOffers() view returns (uint256)",
    params: [],
  });

  if (Number(totalOffers) === 0) {
    return 0;
  } else {
    return Number(totalOffers) - 1;
  }
}

export async function getAllOffers() {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });
  const totalOffers = await getTotalOffers();

  const allOffers = await readContract({
    contract,
    method:
      "function getAllOffers(uint256 _startId, uint256 _endId) view returns ((uint256 offerId, uint256 tokenId, uint256 quantity, uint256 totalPrice, uint256 expirationTimestamp, address offeror, address assetContract, address currency, uint8 tokenType, uint8 status)[] _allOffers)",
    params: [BigInt(0), BigInt(totalOffers)],
  });

  return allOffers;
}
