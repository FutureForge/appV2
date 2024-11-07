import { MARKETPLACE_ADDRESS_TESTNET, nativeCurrency } from "@/utils/configs";
import { getContractCustom } from "..";
import { createListing } from "thirdweb/extensions/marketplace";
import {
  BuyFromDirectListingType,
  CreateDirectListingType,
} from "@/utils/types/blockchain/blockchain.type";
import { prepareContractCall, toWei } from "thirdweb";
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

  console.log({ _params });
  console.log({ contract });

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

  console.log("transaction, blockchain", { transaction });

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
