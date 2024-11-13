import {
  Auction,
  AuctionClosed,
  Listing,
  NewSaleListing,
  Offer,
} from "@/utils/types/graphql";
import { getFormatAddress } from "@/utils/functions";
import { decimalOffChain } from "@/modules/blockchain";

export type NFTCardInfo =
  | "listing"
  | "auction"
  | "offers"
  | "new-listing"
  | "completed-listing"
  | "new-sale-listing"
  | "new-sold-auction"
  | "new-accepted-offers"
  | "new-offers"
  | "new-auction";

export type NFTType =
  | Listing
  | Auction
  | NewSaleListing
  | AuctionClosed
  | Offer;

export type NFTStatus = "listed" | "auctioned";

export type NFTCardProps = {
  data: NFTType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  cta?: string;
  type: NFTCardInfo;
  status?: NFTStatus;
  extraCTA?: string;
  extraOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  ctaStyles?: string;
};
export const getNFTCardInfo = ({
  type,
  data,
}: {
  type: NFTCardInfo;
  data: NFTType;
}) => {
  switch (type) {
    case "new-sale-listing":
      const buyer = "buyer" in data ? data.buyer : "";
      const totalPricePaid =
        "totalPricePaid" in data ? data.totalPricePaid : "";

      return {
        title1: "Price Paid",
        title2: "Bought By",
        info1: `${decimalOffChain(totalPricePaid)} XFI`,
        info2: getFormatAddress(buyer),
      };
    case "new-auction":
      const auctionCreatorNewAuction =
        "auctionCreator" in data ? data.auctionCreator : "";
      const buyoutBidAmountNewAuction =
        "buyoutBidAmount" in data ? data.buyoutBidAmount : "";

      return {
        title1: "Buyout Price",
        title2: "Auctioned By",
        info1: `${decimalOffChain(buyoutBidAmountNewAuction)} XFI`,
        info2: getFormatAddress(auctionCreatorNewAuction),
      };
    case "new-sold-auction":
      const closer = "closer" in data ? data.closer : "";
      const bidAmount = "bidAmount" in data ? (data.bidAmount as bigint) : "";

      return {
        title1: "Buyout Price",
        title2: "Bought By",
        info1: `${decimalOffChain(bidAmount)} XFI`,
        info2: getFormatAddress(closer),
      };
    case "new-offers":
      const offerorNewOffers = "offeror" in data ? data.offeror : "";
      const totalPriceOffered = "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Price Offered",
        title2: "Offered By",
        info1: `${decimalOffChain(totalPriceOffered)} WXFI`,
        info2: getFormatAddress(offerorNewOffers),
      };
    case "new-accepted-offers":
      const seller = "seller" in data ? data.seller : "";
      const totalPriceAccepted =
        "totalPricePaid" in data ? data.totalPricePaid : "";

      return {
        title1: "Price Offered",
        title2: "Accepted By",
        info1: `${decimalOffChain(totalPriceAccepted)} XFI`,
        info2: getFormatAddress(seller as string),
      };
    case "listing":
      const listingCreator =
        "listingCreator" in data ? data.listingCreator : "";
      const listingPrice = "pricePerToken" in data ? data.pricePerToken : "";

      return {
        title1: "Listing Price",
        title2: "Listed By",
        info1: `${decimalOffChain(listingPrice as string)} XFI`,
        info2: getFormatAddress(listingCreator),
      };

    case "auction":
      const auctionCreator =
        "auctionCreator" in data ? data.auctionCreator : "";
      const buyoutBidAmount =
        "buyoutBidAmount" in data ? data.buyoutBidAmount : "";

      return {
        title1: "Buyout Price",
        title2: "Auctioned By",
        info1: `${decimalOffChain(buyoutBidAmount as string)} XFI`,
        info2: getFormatAddress(auctionCreator),
      };
    case "offers":
      const offeror = "offeror" in data ? data.offeror : "";
      const totalPrice = "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Price Offered",
        title2: "Offered By",
        info1: `${decimalOffChain(totalPrice as string)} WXFI`,
        info2: getFormatAddress(offeror),
      };
    case "completed-listing":
      const buyerCompletedListing =
        "nft" in data && data.nft?.owner ? data.nft.owner : "";
      const totalPricePaidCompletedListing =
        "pricePerToken" in data ? data.pricePerToken : "";

      return {
        title1: "Price Paid",
        title2: "Bought By",
        info1: `${decimalOffChain(totalPricePaidCompletedListing)} XFI`,
        info2: getFormatAddress(buyerCompletedListing),
      };
    default:
      return {
        title1: "Floor Price",
        title2: "Volume",
      };
  }
};
