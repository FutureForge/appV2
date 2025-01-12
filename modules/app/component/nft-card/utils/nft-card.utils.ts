import { getFormatAddress } from "@/utils/functions";
import {
  Listing,
  Auction,
  Offer,
} from "@/modules/query/utils/index.utils.query";

export type NFTCardInfo =
  | "listing"
  | "user-listing"
  | "auction"
  | "user-auction"
  | "offers"
  | "user-offers"
  | "user-offers-received"
  | "new-listing"
  // | "bids"
  | "user-bids"
  | "completed-listing"
  // | "new-sale-listing"
  // | "new-sold-auction"
  | "new-accepted-offers"
  | "new-offers"
  | "new-auction";

export type NFTType = Listing | Auction | Offer;

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
};

export const getNFTCardInfo = ({
  type,
  data,
}: {
  type: NFTCardInfo;
  data: NFTType;
}) => {
  switch (type) {
    // case "new-sale-listing":
    //   const buyer = "buyer" in data ? data.buyer : "";
    //   const totalPricePaid =
    //     "totalPricePaid" in data ? data.totalPricePaid : "";

    //   return {
    //     title1: "Price Paid",
    //     title2: "Bought By",
    //     info1: `${(totalPricePaid)} XFI`,
    //     info2: getFormatAddress(buyer),
    //   };

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

    // case "new-sold-auction":
    //   const closer = "closer" in data ? data.closer : "";
    //   const bidAmount = "bidAmount" in data ? (data.bidAmount as string) : "";

    //   return {
    //     title1: "Buyout Price",
    //     title2: "Bought By",
    //     info1: `${bidAmount} XFI`,
    //     info2: getFormatAddress(closer),
    //   };

    case "new-offers":
      const offerorNewOffers = "offeror" in data ? data.offeror : "";
      const totalPriceOffered = "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Price Offered",
        title2: "Offered By",
        info1: `${totalPriceOffered} WXFI`,
        info2: getFormatAddress(offerorNewOffers),
      };

    // case "new-accepted-offers":
    //   const seller = "seller" in data ? data.seller : "";
    //   const totalPriceAccepted =
    //     "totalPricePaid" in data ? data.totalPricePaid : "";

    //   return {
    //     title1: "Price Accepted",
    //     title2: "Seller",
    //     info1: `${(totalPriceAccepted)} XFI`,
    //     info2: getFormatAddress(seller as string),
    //   };

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
        info1: `${listingPriceUserListing as string} XFI`,
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
        info1: `${totalPriceUserOffers as string} WXFI`,
      };

    case "user-offers-received":
      const totalPriceUserOffersRecieved =
        "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Highest Offer",
        info1: `${totalPriceUserOffersRecieved as string} WXFI`,
      };

    case "completed-listing":
      const buyerCompletedListing =
        "nft" in data && data.nft?.owner ? data.nft.owner : "";
      const totalPricePaidCompletedListing =
        "pricePerToken" in data ? data.pricePerToken : "";

      return {
        title1: "Price Paid",
        title2: "Bought By",
        info1: `${totalPricePaidCompletedListing} XFI`,
        info2: getFormatAddress(buyerCompletedListing),
      };

    // case "bids":
    //   const bidderBids = "bidder" in data ? data.bidder : "";
    //   const bidAmountBids = "bidAmount" in data ? data.bidAmount : "";

    //   return {
    //     title1: "Bid Amount",
    //     title2: "Bid By",
    //     info1: `${(bidAmountBids as string)} XFI`,
    //     info2: getFormatAddress(bidderBids),
    //   };

    case "user-bids":
      const bidAmountUserBids = "bidAmount" in data ? data.bidAmount : "";

      return {
        title1: "Bid Amount",
        info1: `${bidAmountUserBids as string} XFI`,
      };

    default:
      return {
        title1: "Floor Price",
        title2: "Volume",
      };
  }
};
