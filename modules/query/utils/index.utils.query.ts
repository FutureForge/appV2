import { formatBlockchainTimestamp } from "@/utils/functions";
import {
  decimalOffChain,
  getContractCustom,
  getIsAuctionExpired,
  getOfferByOfferId,
  getWinningBid,
} from "@/modules/blockchain";
import { getNFT } from "thirdweb/extensions/erc721";
import { NFT as ThirdwebNFTType } from "thirdweb";
import {
  AcceptedOfferEvent,
  Auction,
  AuctionBidEvent,
  CompletedAuctionEvent,
  CompletedListingEvent,
  Listing,
  Offer,
  OfferEvent,
} from "./query.type";
import {
  RawAcceptedOfferEvent,
  RawAuctionBidEvent,
  RawCompletedAuctionEvent,
  RawCompletedListingEvent,
  RawOfferEvent,
} from "../events/type.events";
import { AuctionQueryType } from "..";

export async function formatAuctionData({
  rawAuction,
  nft,
  type,
}: {
  rawAuction: any;
  nft: ThirdwebNFTType;
  type?: AuctionQueryType;
}): Promise<Auction> {
  const endTime = formatBlockchainTimestamp(rawAuction.endTimestamp);
  const endTimeFormatted = new Date(endTime).getTime();
  const currentTime = new Date().getTime();

  const isExpired = currentTime > endTimeFormatted;

  let isAuctionActive = undefined;

  if (type && type !== "completed-auction-collection") {
    isAuctionActive = await getIsAuctionExpired({
      auctionId: rawAuction.auctionId,
    });
  }

  const isAuctionExpired = !isAuctionActive;

  const winningBid = await getWinningBid({
    auctionId: rawAuction.auctionId,
  });

  const winningBidBody = {
    bidder: winningBid[0],
    currency: winningBid[1],
    bidAmount: decimalOffChain(winningBid[2].toString())!,
  };

  return {
    assetContract: rawAuction.assetContract,
    auctionCreator: rawAuction.auctionCreator,
    auctionId: Number(rawAuction.auctionId),
    bidBufferBps: Number(rawAuction.bidBufferBps),
    buyoutBidAmount: Number(decimalOffChain(rawAuction.buyoutBidAmount)),
    currency: rawAuction.currency,
    endTimestamp: formatBlockchainTimestamp(rawAuction.endTimestamp.toString()),
    minimumBidAmount: Number(decimalOffChain(rawAuction.minimumBidAmount)),
    nft,
    quantity: Number(rawAuction.quantity),
    startTimestamp: formatBlockchainTimestamp(
      rawAuction.startTimestamp.toString()
    ),
    status: rawAuction.status,
    timeBufferInSeconds: Number(rawAuction.timeBufferInSeconds),
    tokenId: Number(rawAuction.tokenId),
    isAuctionExpired: isExpired,
    winningBid: winningBidBody,
    isAuctionActivityExpired: isAuctionExpired,
  };
}

export async function formatListingData(
  rawListing: any,
  nft: ThirdwebNFTType
): Promise<Listing> {
  const endTime = formatBlockchainTimestamp(rawListing.endTimestamp);
  const endTimeFormatted = new Date(endTime).getTime();
  const currentTime = new Date().getTime();

  const isExpired = currentTime > endTimeFormatted;

  return {
    assetContract: rawListing.assetContract,
    listingCreator: rawListing.listingCreator,
    listingId: Number(rawListing.listingId),
    currency: rawListing.currency,
    endTimestamp: formatBlockchainTimestamp(rawListing.endTimestamp),
    pricePerToken: Number(decimalOffChain(rawListing.pricePerToken)),
    nft,
    quantity: Number(rawListing.quantity),
    startTimestamp: formatBlockchainTimestamp(
      rawListing.startTimestamp.toString()
    ),
    status: rawListing.status,
    tokenId: Number(rawListing.tokenId),
    reserved: false,
    isListingExpired: isExpired,
  };
}

export async function formatOfferData(
  rawOffer: any,
  nft: ThirdwebNFTType
): Promise<Offer> {
  const endTime = formatBlockchainTimestamp(rawOffer.expirationTimestamp);
  const endTimeFormatted = new Date(endTime).getTime();
  const currentTime = new Date().getTime();

  const isExpired = currentTime > endTimeFormatted;

  return {
    assetContract: rawOffer.assetContract,
    offeror: rawOffer.offeror,
    offerId: Number(rawOffer.offerId),
    currency: rawOffer.currency,
    expirationTimestamp: formatBlockchainTimestamp(
      rawOffer.expirationTimestamp
    ),
    totalPrice: Number(decimalOffChain(rawOffer.totalPrice)),
    nft,
    quantity: Number(rawOffer.quantity),
    status: rawOffer.status,
    tokenId: Number(rawOffer.tokenId),
    isOfferExpired: isExpired,
  };
}

export async function formatCompletedListingSale(
  rawListingData: RawCompletedListingEvent,
  nft: ThirdwebNFTType
): Promise<CompletedListingEvent> {
  return {
    assetContract: rawListingData.assetContract,
    buyer: rawListingData.buyer,
    listingCreator: rawListingData.listingCreator,
    listingId: Number(rawListingData.listingId),
    quantityBought: Number(rawListingData.quantityBought),
    tokenId: Number(rawListingData.tokenId),
    totalPricePaid: Number(decimalOffChain(rawListingData.totalPricePaid)),
    nft,
  };
}

export async function formatCompletedAuctionSale(
  rawAuctionData: RawCompletedAuctionEvent,
  nft: ThirdwebNFTType
): Promise<CompletedAuctionEvent> {
  const winningBid = await getWinningBid({
    auctionId: rawAuctionData.auctionId,
  });

  const winningBidBody = {
    bidder: winningBid[0],
    currency: winningBid[1],
    bidAmount: decimalOffChain(winningBid[2].toString())!,
  };

  return {
    assetContract: rawAuctionData.assetContract,
    closer: rawAuctionData.closer,
    auctionCreator: rawAuctionData.auctionCreator,
    auctionId: Number(rawAuctionData.auctionId),
    tokenId: Number(rawAuctionData.tokenId),
    winningBidder: rawAuctionData.winningBidder,
    bidAmount: Number(winningBidBody.bidAmount),
    nft,
  };
}

export async function formatAcceptedOffer(
  rawAcceptedOfferData: RawAcceptedOfferEvent,
  nft: ThirdwebNFTType
): Promise<AcceptedOfferEvent> {
  return {
    assetContract: rawAcceptedOfferData.assetContract,
    offeror: rawAcceptedOfferData.offeror,
    seller: rawAcceptedOfferData.seller,
    offerId: Number(rawAcceptedOfferData.offerId),
    tokenId: Number(rawAcceptedOfferData.tokenId),
    totalPricePaid: Number(
      decimalOffChain(rawAcceptedOfferData.totalPricePaid)
    ),
    quantityBought: Number(rawAcceptedOfferData.quantityBought),
    nft,
  };
}

export async function formatNewAuctionBid(
  rawNewAuctionBidData: RawAuctionBidEvent,
  nft: ThirdwebNFTType
): Promise<AuctionBidEvent> {
  const endTime = formatBlockchainTimestamp(
    rawNewAuctionBidData.auction.endTimestamp.toString()
  );
  const endTimeFormatted = new Date(endTime).getTime();
  const currentTime = new Date().getTime();

  const isExpired = currentTime > endTimeFormatted;

  let isAuctionExpired = true;

  if (!isExpired) {
    const isAuctionActive = await getIsAuctionExpired({
      auctionId: rawNewAuctionBidData.auctionId,
    });
    isAuctionExpired = !isAuctionActive;
  }

  const auction = {
    assetContract: rawNewAuctionBidData.auction.assetContract,
    auctionCreator: rawNewAuctionBidData.auction.auctionCreator,
    auctionId: Number(rawNewAuctionBidData.auction.auctionId),
    bidBufferBps: Number(rawNewAuctionBidData.auction.bidBufferBps),
    buyoutBidAmount: Number(
      decimalOffChain(rawNewAuctionBidData.auction.buyoutBidAmount)
    ),
    currency: rawNewAuctionBidData.auction.currency,
    endTimestamp: formatBlockchainTimestamp(
      rawNewAuctionBidData.auction.endTimestamp.toString()
    ),
    minimumBidAmount: Number(
      decimalOffChain(rawNewAuctionBidData.auction.minimumBidAmount)
    ),
    nft,
    quantity: Number(rawNewAuctionBidData.auction.quantity),
    startTimestamp: formatBlockchainTimestamp(
      rawNewAuctionBidData.auction.startTimestamp.toString()
    ),
    status: rawNewAuctionBidData.auction.status,
    timeBufferInSeconds: Number(
      rawNewAuctionBidData.auction.timeBufferInSeconds
    ),
    tokenId: Number(rawNewAuctionBidData.auction.tokenId),
    isAuctionExpired: isExpired,
    isAuctionActivityExpired: isAuctionExpired,
  };

  return {
    assetContract: rawNewAuctionBidData.assetContract,
    auction,
    auctionId: Number(rawNewAuctionBidData.auctionId),
    bidAmount: Number(decimalOffChain(rawNewAuctionBidData.bidAmount)),
    bidder: rawNewAuctionBidData.bidder,
  };
}

export async function formatNewOffer(
  rawNewOfferData: RawOfferEvent,
  nft: ThirdwebNFTType
): Promise<OfferEvent> {
  const offer = await getOfferByOfferId({
    offerId: rawNewOfferData.offerId.toString(),
  });

  const status = offer.status;

  return {
    assetContract: rawNewOfferData.assetContract,
    offerId: Number(rawNewOfferData.offerId),
    offeror: rawNewOfferData.offeror,
    offer: {
      assetContract: rawNewOfferData.assetContract,
      currency: rawNewOfferData.offer.currency,
      expirationTimestamp: formatBlockchainTimestamp(
        rawNewOfferData.offer.expirationTimestamp.toString()
      ),
      nft,
      offerId: Number(rawNewOfferData.offerId),
      offeror: rawNewOfferData.offeror,
      quantity: Number(rawNewOfferData.offer.quantity),
      status,
      tokenId: Number(rawNewOfferData.offer.tokenId),
      totalPrice: Number(decimalOffChain(rawNewOfferData.offer.totalPrice)),
    },
  };
}

export async function fetchNFT({
  assetContract,
  tokenId,
}: {
  assetContract: string;
  tokenId: bigint;
}) {
  const contract = getContractCustom({ contractAddress: assetContract });
  return getNFT({
    contract,
    tokenId: tokenId,
    includeOwner: true,
  });
}
