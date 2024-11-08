import {
  Auction,
  AuctionClosed,
  Listing,
  NewSaleListing,
  NFT,
} from "@/utils/types/graphql";
import { getFormatAddress } from "@/utils/functions";
import { decimalOffChain } from "@/modules/blockchain";

export type NFTCardInfo =
  | "listing"
  | "auction"
  | "new-listing"
  | "new-sale-listing"
  | "new-sold-auction"
  | "new-auction";

type NFTType = Listing | Auction | NewSaleListing | AuctionClosed;

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
    default:
      return {
        title1: "Floor Price",
        title2: "Volume",
      };
  }
};
