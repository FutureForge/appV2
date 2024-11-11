import {
  Auction,
  AuctionClosed,
  Listing,
  NewSaleListing,
  NFT,
  Offer,
} from "@/utils/types/graphql";
import { getFormatAddress } from "@/utils/functions";
import { decimalOffChain } from "@/modules/blockchain";

export type NFTCardInfo =
  | "listing"
  | "auction"
  | "new-listing"
  | "new-sale-listing"
  | "new-sold-auction"
  | "new-accepted-offers"
  | "new-offers"
  | "new-auction";

type NFTType = Listing | Auction | NewSaleListing | AuctionClosed | Offer;

export type NFTCardProps = {
  data: NFTType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  cta?: string;
  type: NFTCardInfo;
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
      const auctionCreator =
        "auctionCreator" in data ? data.auctionCreator : "";
      const buyoutBidAmount =
        "buyoutBidAmount" in data ? data.buyoutBidAmount : "";

      return {
        title1: "Buyout Price",
        title2: "Auctioned By",
        info1: `${decimalOffChain(buyoutBidAmount)} XFI`,
        info2: getFormatAddress(auctionCreator),
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
      const offeror = "offeror" in data ? data.offeror : "";
      const totalPriceOffer = "totalPrice" in data ? data.totalPrice : "";

      return {
        title1: "Price Offered",
        title2: "Offered By",
        info1: `${decimalOffChain(totalPriceOffer)} XFI`,
        info2: getFormatAddress(offeror),
      };
    case "new-accepted-offers":
      const seller = "seller" in data ? data.seller : "";
      const totalPriceAccepted = "totalPricePaid" in data ? data.totalPricePaid : "";

      return {
        title1: "Price Offered",
        title2: "Accepted By",
        info1: `${decimalOffChain(totalPriceAccepted)} XFI`,
        info2: getFormatAddress(seller as string),
      };
    default:
      return {
        title1: "Floor Price",
        title2: "Volume",
      };
  }
};
