import { prepareContractCall, readContract } from "thirdweb";
import { getContractCustom } from "..";
import { MARKETPLACE_ADDRESS_TESTNET } from "@/utils/configs";

export async function getCheckApprovedForAll({
  walletAddress,
  contractAddress,
}: {
  walletAddress: string;
  contractAddress: string;
}) {
  const contract = getContractCustom({
    contractAddress: contractAddress,
  });

  const approved = await readContract({
    contract,
    method:
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
    params: [walletAddress, MARKETPLACE_ADDRESS_TESTNET],
  });

  return approved;
}

export async function getCheckApprovedPerTokenId({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {
  const contract = getContractCustom({
    contractAddress: contractAddress,
  });

  const data = await readContract({
    contract,
    method: "function getApproved(uint256 tokenId) view returns (address)",
    params: [BigInt(tokenId)],
  });

  // checks if the value returned is the marketplace address

  const approved =
    data.toLowerCase() === MARKETPLACE_ADDRESS_TESTNET.toLowerCase();

  return approved;
}

export async function getSetApprovalForAll({
  contractAddress,
  approved = true,
}: {
  contractAddress: string;
  approved?: boolean;
}) {
  const contract = getContractCustom({
    contractAddress: contractAddress,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function setApprovalForAll(address operator, bool approved)",
    params: [MARKETPLACE_ADDRESS_TESTNET, approved],
  });

  return transaction;
}

export async function getSetApprovalForTokenId({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
  approved?: boolean;
}) {
  const contract = getContractCustom({
    contractAddress: contractAddress,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function approve(address to, uint256 tokenId)",
    params: [MARKETPLACE_ADDRESS_TESTNET, BigInt(tokenId)],
  });

  return transaction;
}

export async function getPlatformFeeInfoCustom({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const contract = getContractCustom({ contractAddress });

  const platformFee = await readContract({
    contract,
    method: "function getPlatformFeeInfo() view returns (address, uint16)",
    params: [],
  });

  const platformFeeObject = {
    address: platformFee[0] || "0x000000000000000000000000000000000000dEaD",
    percent: platformFee[1] / 100 || 0,
  };

  return platformFeeObject;
}

// LISTING SYNTAX

export const listingSyntax = [
  {
    assetContract: "0x55babEE194af5c59a5f17f9DeA47BE4a37DFB36d",
    tokenId: "1",
    quantity: "1",
    currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    pricePerToken: "100",
    startTimestamp: "1730798114916",
    endTimestamp: "1732998197417",
    reserved: true,
  },
];

// { "assetContract": "0x55babEE194af5c59a5f17f9DeA47BE4a37DFB36d", "tokenId": "6", "quantity": "1", "currency": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", "pricePerToken": "15000000000000000000", "startTimestamp": "1730798114916", "endTimestamp": "1731945989717", "reserved": false }

// AUCTION SYNTAX

export const auctionSyntax = [
  {
    assetContract: "0x1A35a38630b6F56637268F437493601dbF72E61A",
    tokenId: "5",
    quantity: "1",
    currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    minimumBidAmount: "10",
    buyoutBidAmount: "50",
    timeBufferInSeconds: "100",
    bidBufferBps: "100",
    startTimestamp: "1730798114916",
    endTimestamp: "1732998197417",
  },
];

// { "assetContract": "0x07c222a5A1a78013042f04ff905Da8E2C93fcde4", "tokenId": "4", "quantity": "1", "currency": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", "minimumBidAmount": "15000000000000000000", "buyoutBidAmount": "30000000000000000000", "timeBufferInSeconds": "300", "bidBufferBps": "5", "startTimestamp": "1730851620449", "endTimestamp": "1731945989717" }

export const makeOfferSyntax = [
  {
    assetContract: "0x...",
    tokenId: "0",
    quantity: "0",
    currency: "0x...",
    totalPrice: "0",
    expirationTimestamp: "0",
  },
];

// { "assetContract": "0x1A35a38630b6F56637268F437493601dbF72E61A", "tokenId": "0", "quantity": "0", "currency": "0x...", "totalPrice": "0", "expirationTimestamp": "0" }
