import {
  Auction,
  AuctionClosed,
  Listing,
  NewSaleListing,
} from "@/utils/types/graphql";

export type MarketplaceEventData = {
  newListing: Listing[];
  newAuction: Auction[];
  newSaleListing: NewSaleListing[];
  recentlySoldAuction: AuctionClosed[];
};
