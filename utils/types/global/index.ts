type NFTActivity = {
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

type NFTActivityResponse = {
  docs: NFTActivity[];
  hasNext: boolean;
  limit: number;
  page: number;
};
