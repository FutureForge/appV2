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

export type NFTCardProps = {
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
};

export const getNFTCardInfo = ({
  type,
  data,
}: {
  type: NFTCardInfo;
  data: NFTType;
}): {
  title1: string;
  title2: string;
  info1: string;
  info2: string;
} => {
  switch (type) {
    case "new-auction":
      const auctionCreatorNewAuction =
        "auctionCreator" in data ? data.auctionCreator : "";
      const buyoutBidAmountNewAuction =
        "buyoutBidAmount" in data ? data.buyoutBidAmount : "";

      return {
        title1: "Buyout Price",
        title2: "Auctioned By",
        info1: `${buyoutBidAmountNewAuction} XFI`,
        info2: getFormatAddress(auctionCreatorNewAuction),
      };

    case "new-offers":
      const offerorNewOffers = "offeror" in data ? data.offeror : "";
      const totalPriceOffered = "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Price Offered",
        title2: "Offered By",
        info1: `${totalPriceOffered} WXFI`,
        info2: getFormatAddress(offerorNewOffers),
      };

    case "listing":
      const listingCreator =
        "listingCreator" in data ? data.listingCreator : "";
      const listingPrice = "pricePerToken" in data ? data.pricePerToken : "";

      return {
        title1: "Listing Price",
        title2: "Listed By",
        info1: `${listingPrice as string} XFI`,
        info2: getFormatAddress(listingCreator),
      };

    case "user-listing":
      const listingPriceUserListing =
        "pricePerToken" in data ? data.pricePerToken : "";

      return {
        title1: "Listing Price",
        title2: "",
        info1: `${listingPriceUserListing as string} XFI`,
        info2: "",
      };

    case "auction":
      const auctionCreator =
        "auctionCreator" in data ? data.auctionCreator : "";
      const buyoutBidAmount =
        "buyoutBidAmount" in data ? data.buyoutBidAmount : "";

      return {
        title1: "Buyout Price",
        title2: "Auctioned By",
        info1: `${buyoutBidAmount as string} XFI`,
        info2: getFormatAddress(auctionCreator),
      };

    case "user-auction":
      const minimumBidAmountUserAuction =
        "minimumBidAmount" in data ? data.minimumBidAmount : "";
      const buyoutBidAmountUserAuction =
        "buyoutBidAmount" in data ? data.buyoutBidAmount : "";

      return {
        title1: "Buyout Price",
        title2: "Minimum Bid",
        info1: `${buyoutBidAmountUserAuction as string} XFI`,
        info2: `${minimumBidAmountUserAuction as string} XFI`,
      };

    case "offers":
      const offeror = "offeror" in data ? data.offeror : "";
      const totalPrice = "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Price Offered",
        title2: "Offered By",
        info1: `${totalPrice as string} WXFI`,
        info2: getFormatAddress(offeror),
      };

    case "user-offers":
      const totalPriceUserOffers = "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Price Offered",
        title2: "",
        info1: `${totalPriceUserOffers as string} WXFI`,
        info2: "",
      };

    case "user-offers-received":
      const totalPriceUserOffersRecieved =
        "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Highest Offer",
        title2: "",
        info1: `${totalPriceUserOffersRecieved as string} WXFI`,
        info2: "",
      };

    case "completed-listing":
      const buyerCompletedListing = "buyer" in data && data ? data.buyer : "";
      const totalPricePaidCompletedListing =
        "totalPricePaid" in data ? data.totalPricePaid : "";

      return {
        title1: "Price Paid",
        title2: "Bought By",
        info1: `${totalPricePaidCompletedListing} XFI`,
        info2: getFormatAddress(buyerCompletedListing),
      };

    case "completed-auction":
      const winningBidAuction =
        "winningBidder" in data && data ? data.winningBidder : "";
      const bidAmountAuction = "bidAmount" in data ? data.bidAmount : "";

      return {
        title1: "Price Paid",
        title2: "Bought By",
        info1: `${bidAmountAuction} XFI`,
        info2: getFormatAddress(winningBidAuction),
      };

    case "accepted-offers":
      const acceptedOfferSeller = "seller" in data && data ? data.seller : "";
      const acceptedOfferTotalPricePaid =
        "totalPricePaid" in data ? data.totalPricePaid : "";

      return {
        title1: "Price Paid",
        title2: "Bought By",
        info1: `${acceptedOfferTotalPricePaid} XFI`,
        info2: getFormatAddress(acceptedOfferSeller),
      };

    case "auction-bids":
      const bidderBids = "bidder" in data ? data.bidder : "";
      const bidAmountBids = "bidAmount" in data ? data.bidAmount : "";

      return {
        title1: "Bid Amount",
        title2: "Bidder",
        info1: `${bidAmountBids as string} XFI`,
        info2: getFormatAddress(bidderBids),
      };

    case "user-bids":
      const bidAmountUserBids = "bidAmount" in data ? data.bidAmount : "";

      return {
        title1: "Bid Amount",
        title2: "",
        info1: `${bidAmountUserBids as string} XFI`,
        info2: "",
      };

    default:
      return {
        title1: "Floor Price",
        title2: "Volume",
        info1: "",
        info2: "",
      };
  }
};
