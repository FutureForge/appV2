export type NFTActivity = {
  addressFrom: string;
  addressTo: string;
  blockNumber: number;
  contractAddress: string;
  decimals: number | null;
  timestamp: string;
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
  txHash: string;
  uniqueHash: string;
};

export type NFTActivityResponse = {
  docs: NFTActivity[];
  hasNext: boolean;
  limit: number;
  page: number;
};

export interface NFTData {
  address: string;
  balance: string;
  blockNumber: number;
  contractAddress: string;
  decimals: string | null;
  timestamp: string;
  tokenIds: string[];
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
}

export interface UserNFTResponse {
  docs: NFTData[];
  hasNext: boolean;
  limit: number;
  page: number;
}

export interface Social {
  socialName: string;
  socialLink: string;
}
