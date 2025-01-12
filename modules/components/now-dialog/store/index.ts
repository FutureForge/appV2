import { Listing, Auction } from "@/modules/query/utils/index.utils.query";
import { NFT } from "@/utils/types/graphql";
import { create } from "zustand";

interface BuyNowListingDialogStore {
  listingInfo: Listing;
  setListingInfo: (listingInfo: Listing) => void;
}

interface BuyNowAuctionDialogStore {
  auctionInfo: Auction;
  setAuctionInfo: (auctionInfo: Auction) => void;
}

interface NFTInfoStore {
  nftInfo: NFT;
  setNFTInfo: (nftInfo: NFT) => void;
}

export type Fee = {
  address: string;
  percent: number;
};

// interface FeeStore {
//   collectionFee: Fee;
//   marketplaceFee: Fee;
//   setCollectionFee: (collectionFee: Fee) => void;
//   setMarketplaceFee: (marketplaceFee: Fee) => void;
// }

export const useListingInfoStore = create<BuyNowListingDialogStore>((set) => ({
  listingInfo: {} as Listing,
  setListingInfo: (listingInfo) => set({ listingInfo }),
}));

export const useAuctionInfoStore = create<BuyNowAuctionDialogStore>((set) => ({
  auctionInfo: {} as Auction,
  setAuctionInfo: (auctionInfo) => set({ auctionInfo }),
}));

export const useNFTInfoStore = create<NFTInfoStore>((set) => ({
  nftInfo: {} as NFT,
  setNFTInfo: (nftInfo) => set({ nftInfo }),
}));

// export const useCollectionFeeStore = create<FeeStore>((set) => ({
//   collectionFee: { address: "", percent: 0 },
//   setCollectionFee: (collectionFee: Fee) => set({ collectionFee }),
//   marketplaceFee: { address: "", percent: 0 },
//   setMarketplaceFee: (marketplaceFee: Fee) => set({ marketplaceFee }),
// }));
