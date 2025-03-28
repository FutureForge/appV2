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
  const defaultInfo: CardInfo = {
    title1: "Floor Price",
    title2: "Volume",
    info1: "",
    info2: "",
  };

  try {
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
        break;

      case "new-offers":
        if (isOffer(data)) {
          return {
            title1: "Price Offered",
            title2: "Offered By",
            info1: `${data.totalPrice} WXFI`,
            info2: getFormatAddress(data.offeror),
          };
        }
        break;

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
        break;

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
        break;

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
        break;

      case "completed-listing":
      case "completed-auction":
      case "accepted-offers":
        if (isCompletedListingEvent(data) && type === "completed-listing") {
          return {
            title1: "Price Paid",
            title2: "Bought By",
            info1: `${data.totalPricePaid} XFI`,
            info2: getFormatAddress(data.buyer),
          };
        } else if (
          isCompletedAuctionEvent(data) &&
          type === "completed-auction"
        ) {
          return {
            title1: "Price Paid",
            title2: "Bought By",
            info1: `${data.bidAmount} XFI`,
            info2: getFormatAddress(data.winningBidder),
          };
        } else if (isAcceptedOfferEvent(data) && type === "accepted-offers") {
          return {
            title1: "Price Paid",
            title2: "Bought By",
            info1: `${data.totalPricePaid} XFI`,
            info2: getFormatAddress(data.seller),
          };
        }
        break;

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
        break;
    }
  } catch (error) {
    console.error("Error getting NFT card info:", error);
  }

  return defaultInfo;
};
