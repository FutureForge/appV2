import { MARKETPLACE_ADDRESS_TESTNET, nativeCurrency } from "@/utils/configs";
import { getContractCustom } from "..";
import { createListing } from "thirdweb/extensions/marketplace";
import {
  BuyFromDirectListingType,
  CreateDirectListingType,
} from "@/utils/types/blockchain/blockchain.type";
import { prepareContractCall, readContract, toWei } from "thirdweb";
import {
  getCurrentBlockchainTimestamp,
  getEndBlockchainTimestamp,
} from "@/utils/functions";

export async function getCreateDirectListing({
  params: _params,
}: {
  params: Partial<CreateDirectListingType>;
}) {
  if (!_params.endTimestamp) {
    return;
  }

  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  if (
    !_params.assetContract ||
    !_params.tokenId ||
    !_params.pricePerToken ||
    !_params.endTimestamp
  ) {
    return;
  }

  const transaction = createListing({
    contract,
    assetContractAddress: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    pricePerToken: _params.pricePerToken,
    endTimestamp: _params.endTimestamp,
    currencyContractAddress: _params.currency || nativeCurrency,
    isReservedListing: false,
  });

  return transaction;
}

export async function getUpdateDirectListing({
  listingId,
  params: _params,
}: {
  listingId: string;
  params: CreateDirectListingType;
}) {
  if (!_params.endTimestamp) {
    throw new Error("End timestamp is required");
  }

  const startTimestamp = getCurrentBlockchainTimestamp();
  const endTimestamp = getEndBlockchainTimestamp(_params.endTimestamp);

  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const formattedParams = {
    assetContract: _params.assetContract,
    tokenId: BigInt(_params.tokenId),
    quantity: BigInt(_params.quantity),
    currency: _params.currency || nativeCurrency,
    pricePerToken: toWei(_params.pricePerToken),
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    reserved: _params.reserved || false,
  };

  const transaction = await prepareContractCall({
    contract,
    method:
      "function updateListing(uint256 _listingId, (address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params)",
    params: [BigInt(listingId), formattedParams],
  });

  return transaction;
}

export async function getCancelDirectListing({
  listingId,
}: {
  listingId: string;
}) {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function cancelListing(uint256 _listingId)",
    params: [BigInt(listingId)],
  });

  return transaction;
}

export async function getBuyFromDirectListing({
  params: _params,
}: {
  params: BuyFromDirectListingType;
}) {
  const currency = _params.currency || nativeCurrency;
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const transaction = await prepareContractCall({
    contract,
    method:
      "function buyFromListing(uint256 _listingId, address _buyFor, uint256 _quantity, address _currency, uint256 _expectedTotalPrice) payable",
    params: [
      BigInt(_params.listingId),
      _params.buyFor,
      BigInt(_params.quantity),
      currency,
      toWei(_params.totalPrice),
    ],
    value: toWei(_params.totalPrice),
  });

  return transaction;
}

export async function getTotalListings() {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });
  const totalListings = await readContract({
    contract,
    method: "function totalListings() view returns (uint256)",
    params: [],
  });

  if (Number(totalListings) === 0) {
    return 0;
  } else {
    return Number(totalListings) - 1;
  }
}

export async function getAllListing() {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });
  const totalListings = await getTotalListings();

  const allListings = await readContract({
    contract,
    method:
      "function getAllListings(uint256 _startId, uint256 _endId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved)[] _allListings)",
    params: [BigInt(0), BigInt(totalListings)],
  });

  return allListings;
}

export async function getListingByListingId({ listingId }: { listingId: string }) {
  const contract = getContractCustom({
    contractAddress: MARKETPLACE_ADDRESS_TESTNET,
  });

  const data = await readContract({
    contract,
    method:
      "function getListing(uint256 _listingId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved) listing)",
    params: [BigInt(listingId)],
  });

  return data;
}
