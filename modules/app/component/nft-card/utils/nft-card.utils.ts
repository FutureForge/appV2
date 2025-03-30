import { getFormatAddress } from "@/utils/functions";
import {
  Listing,
  Auction,
  Offer,
  AuctionBidEvent,
  CompletedListingEvent,
  CompletedAuctionEvent,
  AcceptedOfferEvent,
} from "@/modules/query/utils";
import { NFT } from "thirdweb";
import { DEAD_ADDRESS } from "@/utils/configs";

export type NFTCardInfo =
  | "listing"
  | "user-listing"
  | "auction"
  | "user-auction"
  | "offers"
  | "user-offers"
  | "user-offers-received"
  | "new-listing"
  | "auction-bids"
  | "user-bids"
  | "completed-listing"
  | "completed-auction"
  | "accepted-offers"
  | "new-offers"
  | "new-auction";

export type NFTType =
  | Listing
  | Auction
  | Offer
  | AuctionBidEvent
  | CompletedListingEvent
  | CompletedAuctionEvent
  | AcceptedOfferEvent;

export type NFTStatus = "listed" | "auctioned";

export interface NFTCardProps {
  data: NFTType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  cta?: string;
  type: NFTCardInfo;
  status?: NFTStatus;
  ctaStyles?: string;
  extraTitle?: string;
  extraInfo?: number | string;
  extraCTA?: string;
  actionCTA?: string;
  actionOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
  nft: NFT;
}

interface CardInfo {
  title1: string;
  title2: string;
  info1: string;
  info2: string;
}

const isListing = (data: NFTType): data is Listing => "listingCreator" in data;
const isAuction = (data: NFTType): data is Auction => "auctionCreator" in data;
const isOffer = (data: NFTType): data is Offer => "offeror" in data;
const isAuctionBidEvent = (data: NFTType): data is AuctionBidEvent =>
  "bidder" in data;
const isCompletedListingEvent = (
  data: NFTType
): data is CompletedListingEvent => "buyer" in data;
const isCompletedAuctionEvent = (
  data: NFTType
): data is CompletedAuctionEvent => "winningBidder" in data;
const isAcceptedOfferEvent = (data: NFTType): data is AcceptedOfferEvent =>
  "seller" in data;

export const getNFTCardInfo = ({
  type,
  data,
}: {
  type: NFTCardInfo;
  data: NFTType;
}): CardInfo => {
  switch (type) {
    case "new-auction":
      if (isAuction(data)) {
        return {
          title1: "Buyout Price",
          title2: "Auctioned By",
          info1: `${data.buyoutBidAmount} XFI`,
          info2: getFormatAddress(data.auctionCreator),
        };
      }

    case "new-offers":
      if (isOffer(data)) {
        return {
          title1: "Price Offered",
          title2: "Offered By",
          info1: `${data.totalPrice} WXFI`,
          info2: getFormatAddress(data.offeror),
        };
      }

    case "listing":
    case "user-listing":
      if (isListing(data)) {
        return type === "listing"
          ? {
              title1: "Listing Price",
              title2: "Listed By",
              info1: `${data.pricePerToken} XFI`,
              info2: getFormatAddress(data.listingCreator),
            }
          : {
              title1: "Listing Price",
              title2: "",
              info1: `${data.pricePerToken} XFI`,
              info2: "",
            };
      }

    case "auction":
    case "user-auction":
      if (isAuction(data)) {
        return type === "auction"
          ? {
              title1: "Buyout Price",
              title2: "Auctioned By",
              info1: `${data.buyoutBidAmount} XFI`,
              info2: getFormatAddress(data.auctionCreator),
            }
          : {
              title1: "Buyout Price",
              title2: "Minimum Bid",
              info1: `${data.buyoutBidAmount} XFI`,
              info2: `${data.minimumBidAmount} XFI`,
            };
      }

    case "offers":
    case "user-offers":
    case "user-offers-received":
      if (isOffer(data)) {
        switch (type) {
          case "offers":
            return {
              title1: "Price Offered",
              title2: "Offered By",
              info1: `${data.totalPrice} WXFI`,
              info2: getFormatAddress(data.offeror),
            };
          case "user-offers":
            return {
              title1: "Price Offered",
              title2: "",
              info1: `${data.totalPrice} WXFI`,
              info2: "",
            };
          case "user-offers-received":
            return {
              title1: "Highest Offer",
              title2: "",
              info1: `${data.totalPrice} WXFI`,
              info2: "",
            };
        }
      }

    case "completed-listing":
    case "completed-auction":
    case "accepted-offers":
      if (
        isCompletedListingEvent(data) ||
        (isListing(data) && type === "completed-listing")
      ) {
        const completedListingInfo1 = isCompletedListingEvent(data)
          ? data.totalPricePaid
          : isListing(data)
          ? data.pricePerToken
          : "";
        const completedListingInfo2 = isCompletedListingEvent(data)
          ? data.buyer
          : isListing(data)
          ? data.nft.owner
          : DEAD_ADDRESS;

        return {
          title1: "Price Paid",
          title2: "Bought By",
          info1: `${completedListingInfo1} XFI`,
          info2: getFormatAddress(completedListingInfo2!),
        };
      } else if (
        isCompletedAuctionEvent(data) ||
        (isAuction(data) && type === "completed-auction")
      ) {
        const completedAuctionInfo1 = isCompletedAuctionEvent(data)
          ? data.bidAmount
          : isAuction(data)
          ? data.buyoutBidAmount
          : "";
        const completedAuctionInfo2 = isCompletedAuctionEvent(data)
          ? data.winningBidder
          : isAuction(data)
          ? data.winningBid?.bidder
          : DEAD_ADDRESS;

        return {
          title1: "Price Paid",
          title2: "Bought By",
          info1: `${completedAuctionInfo1} XFI`,
          info2: getFormatAddress(completedAuctionInfo2!),
        };
      } else if (isAcceptedOfferEvent(data) && type === "accepted-offers") {
        return {
          title1: "Price Paid",
          title2: "Bought By",
          info1: `${data.totalPricePaid} XFI`,
          info2: getFormatAddress(data.seller),
        };
      }

    case "auction-bids":
    case "user-bids":
      if (isAuctionBidEvent(data)) {
        return type === "auction-bids"
          ? {
              title1: "Bid Amount",
              title2: "Bidder",
              info1: `${data.bidAmount} XFI`,
              info2: getFormatAddress(data.bidder),
            }
          : {
              title1: "Bid Amount",
              title2: "",
              info1: `${data.bidAmount} XFI`,
              info2: "",
            };
      }

    default:
      return {
        title1: "Floor Price",
        title2: "Volume",
        info1: "",
        info2: "",
      };
  }
};
