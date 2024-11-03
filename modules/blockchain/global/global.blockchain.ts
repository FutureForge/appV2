import { prepareContractCall, readContract } from "thirdweb";
import { getContractCustom } from "..";
import { MARKETPLACE_ADDRESS } from "@/utils/configs";

export async function getCheckApprovedForAll({
  walletAddress,
  collectionContractAddress,
}: {
  walletAddress: string;
  collectionContractAddress: string;
}) {
  const contract = getContractCustom({
    contractAddress: collectionContractAddress,
  });

  const approved = await readContract({
    contract,
    method:
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
    params: [walletAddress, MARKETPLACE_ADDRESS],
  });

  return approved;
}

export async function getSetApprovalForAll({
  collectionContractAddress,
  approved = true,
}: {
  collectionContractAddress: string;
  approved?: boolean;
}) {
  const contract = getContractCustom({
    contractAddress: collectionContractAddress,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "function setApprovalForAll(address operator, bool approved)",
    params: [MARKETPLACE_ADDRESS, approved],
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
