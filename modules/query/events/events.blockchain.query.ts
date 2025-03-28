import { getContractCustom, getContractEthers } from "@/modules/blockchain";
import {
  getAcceptedOfferEvent,
  getCompletedAuctionEvent,
  getCompletedListingEvent,
  getNewAuctionBidEvent,
  getNewOfferEvent,
} from "@/modules/blockchain/events/index.event";
import { CROSSFI_API_URL, MARKETPLACE_ADDRESS } from "@/utils/configs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getContractEvents, Hex } from "thirdweb";
import {
  fetchNFT,
  formatAcceptedOffer,
  formatCompletedAuctionSale,
  formatCompletedListingSale,
  formatNewAuctionBid,
  formatNewOffer,
} from "../utils/index.utils.query";
import {
  EventLog,
  RawAcceptedOfferEvent,
  RawAuctionBidEvent,
  RawCompletedAuctionEvent,
  RawCompletedListingEvent,
  RawOfferEvent,
} from "./type.events";
import { StatusType } from "@/utils/enums/messages/index.enum";
import { queryKeys } from "../query-keys";
import MarketplaceABI from "@/utils/abi/marketplaceABI.json";
import { ethers } from "ethers";

const EventQueryLimit = 1000;

const MARKETPLACE_CONTRACT_INTERFACE = getContractEthers({
  contractAddress: MARKETPLACE_ADDRESS,
  abi: MarketplaceABI,
});

const MARKETPLACE_INTERFACE = new ethers.utils.Interface(MarketplaceABI);

async function getEventArgs({
  blockHash,
  event,
}: {
  event: any;
  blockHash?: string;
}) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_ADDRESS });

  const eventResult = await getContractEvents({
    contract,
    events: [event],
    blockHash: blockHash as Hex,
  });

  return eventResult[0].args;
}

function getEventArgsEthers({
  data,
  name,
  topics,
}: {
  name: string;
  data: string;
  topics: string[];
}) {
  try {
    const decodedData = MARKETPLACE_INTERFACE.decodeEventLog(
      name,
      data,
      topics
    );

    return decodedData as any;
  } catch (error) {
    console.error("decoded event data", { error });
    return [];
  }
}

export function useAllContractEventQuery() {
  return useQuery({
    queryKey: [queryKeys.events.allContractEvent],
    queryFn: async () => {
      const response = await axios.get<EventLog>(
        `${CROSSFI_API_URL}/event-logs?contractAddress=${MARKETPLACE_ADDRESS}&removed=false&page=1&limit=${EventQueryLimit}&sort=-blockNumber`
      );

      return response.data.docs;
    },
    // staleTime: 1000 * 60 * 30, // Consider data fresh for 1 minute
    // gcTime: 1000 * 60 * 5 * 30, // Keep in cache for 5 minutes
    refetchInterval: 5000, // Refetch every 5 minutes
  });
}

export function useCompletedListingEventQuery({
  limit = 50,
  contractAddress,
}: {
  limit?: number;
  contractAddress?: string;
}) {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: [queryKeys.events.completedListing, { limit, contractAddress }],
    queryFn: async () => {
      if (!allContractEventQuery.data) return [];

      try {
        const listingEvent = await getCompletedListingEvent();
        const eventLogs = allContractEventQuery.data;

        const listingEvents = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() === listingEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              // console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event)
          .filter(Boolean);

        if (!listingEvents.length) return [];

        const eventResults = listingEvents.map((listingEvents) => {
          const decodedEvents = getEventArgsEthers({
            data: listingEvents.rawData.data,
            topics: listingEvents.rawData.topics,
            name: listingEvent.abiEvent.name,
          });

          const formattedDecodedEvents: RawCompletedListingEvent = {
            assetContract: decodedEvents.assetContract,
            buyer: decodedEvents.buyer,
            listingCreator: decodedEvents.listingCreator,
            listingId: decodedEvents.listingId.toString(),
            tokenId: decodedEvents.tokenId.toString(),
            quantityBought: decodedEvents.quantityBought.toString(),
            totalPricePaid: decodedEvents.totalPricePaid.toString(),
          };

          return formattedDecodedEvents;
        });

        const formattedData = await Promise.allSettled(
          eventResults.map(async (listing) => {
            try {
              if (!listing.assetContract || !listing.tokenId) return null;

              const nft = await fetchNFT({
                assetContract: listing.assetContract,
                tokenId: listing.tokenId,
              });
              return formatCompletedListingSale(listing, nft);
            } catch (error) {
              console.error("Error formatting listing data:", error);
              return null;
            }
          })
        );

        const validFormattedData = formattedData
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled" && result.value !== null
          )
          .map((result) => result.value);

        if (contractAddress) {
          return validFormattedData.filter((data) => {
            return (
              data?.assetContract?.toLowerCase() ===
              contractAddress.toLowerCase()
            );
          });
        } else {
          return validFormattedData.slice(0, limit);
        }
      } catch (error) {
        // console.error("Error in useCompletedListingEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data && (!!limit || !!contractAddress),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    // refetchInterval: 5000,
  });
}

export function useCompletedAuctionEventQuery({
  limit = 50,
  contractAddress,
}: {
  limit?: number;
  contractAddress?: string;
}) {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: [queryKeys.events.completedAuction, { limit, contractAddress }],
    queryFn: async () => {
      if (!allContractEventQuery.data) return [];

      try {
        const auctionEvent = await getCompletedAuctionEvent();
        const eventLogs = allContractEventQuery.data;

        const auctionEvents = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() === auctionEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              // console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event)
          .filter(Boolean);

        if (!auctionEvents.length) return [];

        const eventResults = auctionEvents.map((auctionEvents) => {
          const decodedEvents = getEventArgsEthers({
            data: auctionEvents.rawData.data,
            topics: auctionEvents.rawData.topics,
            name: auctionEvent.abiEvent.name,
          });

          const formattedDecodedEvents: RawCompletedAuctionEvent = {
            assetContract: decodedEvents.assetContract,
            auctionCreator: decodedEvents.auctionCreator,
            auctionId: decodedEvents.auctionId.toString(),
            closer: decodedEvents.closer,
            winningBidder: decodedEvents.winningBidder,
            tokenId: decodedEvents.tokenId.toString(),
          };

          return formattedDecodedEvents;
        });

        const updatedEventData = eventResults
          .filter(
            (event) =>
              event.closer.toLowerCase() === event.winningBidder.toLowerCase()
          )
          .filter(
            (event, index, self) =>
              index === self.findIndex((e) => e.auctionId === event.auctionId)
          );

        const formattedData = await Promise.allSettled(
          updatedEventData.map(async (auction) => {
            try {
              if (!auction.assetContract || !auction.tokenId) return null;

              const nft = await fetchNFT({
                assetContract: auction.assetContract,
                tokenId: auction.tokenId,
              });
              return formatCompletedAuctionSale(auction, nft);
            } catch (error) {
              console.error("Error formatting auction data:", error);
              return null;
            }
          })
        );

        const validFormattedData = formattedData
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled" && result.value !== null
          )
          .map((result) => result.value);

        if (contractAddress) {
          return validFormattedData.filter((data) => {
            return (
              data.assetContract.toLowerCase() === contractAddress.toLowerCase()
            );
          });
        } else {
          return validFormattedData.slice(0, limit);
        }
      } catch (error) {
        console.error("Error in useCompletedAuctionEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data && (!!limit || !!contractAddress),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    // refetchInterval: 5000,
  });
}

export function useAcceptedOfferEventQuery({ limit = 50 }: { limit?: number }) {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: [queryKeys.events.acceptedOffer, { limit }],
    queryFn: async () => {
      if (!allContractEventQuery.data) return [];

      try {
        const acceptedOfferEvent = await getAcceptedOfferEvent();
        const eventLogs = allContractEventQuery.data;

        const acceptedOfferEvents = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() ===
                  acceptedOfferEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              // console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event)
          .filter(Boolean);

        if (!acceptedOfferEvents.length) return [];

        const eventResults = acceptedOfferEvents.map((offerEvent) => {
          const decodedEvents = getEventArgsEthers({
            data: offerEvent.rawData.data,
            topics: offerEvent.rawData.topics,
            name: acceptedOfferEvent.abiEvent.name,
          });

          const formattedDecodedEvents: RawAcceptedOfferEvent = {
            assetContract: decodedEvents.assetContract,
            offerId: decodedEvents.offerId.toString(),
            offeror: decodedEvents.offeror,
            quantityBought: decodedEvents.quantityBought.toString(),
            seller: decodedEvents.seller,
            tokenId: decodedEvents.tokenId.toString(),
            totalPricePaid: decodedEvents.totalPricePaid.toString(),
          };

          return formattedDecodedEvents;
        });

        const formattedData = await Promise.allSettled(
          eventResults.map(async (offer) => {
            try {
              if (!offer.assetContract || !offer.tokenId) return null;

              const nft = await fetchNFT({
                assetContract: offer.assetContract,
                tokenId: offer.tokenId,
              });
              return formatAcceptedOffer(offer, nft);
            } catch (error) {
              console.error("Error formatting offer data:", error);
              return null;
            }
          })
        );

        const validFormattedData = formattedData
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled" && result.value !== null
          )
          .map((result) => result.value);

        return validFormattedData.slice(0, limit);
      } catch (error) {
        console.error("Error in useAcceptedOfferEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data && !!limit,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    // refetchInterval: 5000,
  });
}

export function useAuctionBidEventQuery({ limit = 50 }: { limit?: number }) {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: [queryKeys.events.auctionBid, { limit }],
    queryFn: async () => {
      if (!allContractEventQuery.data) return [];

      try {
        const newAuctionBidEvent = await getNewAuctionBidEvent();
        const eventLogs = allContractEventQuery.data;

        const newAuctionBidEvents = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() ===
                  newAuctionBidEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event)
          .filter(Boolean);

        if (!newAuctionBidEvents.length) return [];

        const eventResults = newAuctionBidEvents.map((newAuctionEvent) => {
          const decodedEvents = getEventArgsEthers({
            data: newAuctionEvent.rawData.data,
            topics: newAuctionEvent.rawData.topics,
            name: newAuctionBidEvent.abiEvent.name,
          });

          const formattedDecodedEvents: RawAuctionBidEvent = {
            assetContract: decodedEvents.assetContract,
            auctionId: decodedEvents.auctionId.toString(),
            bidAmount: decodedEvents.bidAmount.toString(),
            bidder: decodedEvents.bidder,
            auction: {
              assetContract: decodedEvents.auction.assetContract,
              auctionCreator: decodedEvents.auction.auctionCreator,
              auctionId: decodedEvents.auction.auctionId.toString(),
              bidBufferBps: decodedEvents.auction.bidBufferBps.toString(),
              buyoutBidAmount: decodedEvents.auction.buyoutBidAmount.toString(),
              currency: decodedEvents.auction.currency,
              endTimestamp: decodedEvents.auction.endTimestamp.toString(),
              minimumBidAmount:
                decodedEvents.auction.minimumBidAmount.toString(),
              quantity: decodedEvents.auction.quantity.toString(),
              startTimestamp: decodedEvents.auction.startTimestamp.toString(),
              status: decodedEvents.auction.status,
              timeBufferInSeconds:
                decodedEvents.auction.timeBufferInSeconds.toString(),
              tokenId: decodedEvents.auction.tokenId.toString(),
              tokenType: decodedEvents.auction.tokenType,
            },
          };

          return formattedDecodedEvents;
        });

        const formattedData = await Promise.allSettled(
          eventResults.map(async (auctionBid) => {
            try {
              if (!auctionBid.assetContract || !auctionBid.auction.tokenId)
                return null;

              const nft = await fetchNFT({
                assetContract: auctionBid.assetContract,
                tokenId: auctionBid.auction.tokenId,
              });
              return formatNewAuctionBid(auctionBid, nft);
            } catch (error) {
              console.error("Error formatting auction bid data:", error);
              return null;
            }
          })
        );

        const validFormattedData = formattedData
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled" && result.value !== null
          )
          .map((result) => result.value);

        const filteredFormattedData = validFormattedData.filter(
          (auctionBid) => {
            return auctionBid;
            // return !(
            //   auctionBid.auction.isAuctionExpired ||
            //   auctionBid.auction.isAuctionActivityExpired
            // );
          }
        );

        return filteredFormattedData.slice(0, limit);
      } catch (error) {
        console.error("Error in useAuctionBidEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data && !!limit,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    // refetchInterval: 5000,
  });
}

export function useNewOfferEventQuery({ limit = 50 }: { limit?: number }) {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: [queryKeys.events.newOffer],
    queryFn: async () => {
      if (!allContractEventQuery.data) return [];

      try {
        const newOfferEvent = await getNewOfferEvent();
        const eventLogs = allContractEventQuery.data;

        const newOfferEvents = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() ===
                  newOfferEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event)
          .filter(Boolean);

        if (!newOfferEvents.length) return [];

        const eventResults = newOfferEvents.map((newOffer) => {
          const decodedEvents = getEventArgsEthers({
            data: newOffer.rawData.data,
            topics: newOffer.rawData.topics,
            name: newOfferEvent.abiEvent.name,
          });

          const formattedDecodedEvents: RawOfferEvent = {
            assetContract: decodedEvents.assetContract,
            offerId: decodedEvents.offerId.toString(),
            offeror: decodedEvents.offeror,
            offer: {
              assetContract: decodedEvents.offer.assetContract,
              currency: decodedEvents.offer.currency,
              expirationTimestamp:
                decodedEvents.offer.expirationTimestamp.toString(),
              offerId: decodedEvents.offer.offerId.toString(),
              offeror: decodedEvents.offer.bidder,
              status: decodedEvents.offer.status,
              totalPrice: decodedEvents.offer.totalPrice.toString(),
              tokenId: decodedEvents.offer.tokenId.toString(),
              tokenType: decodedEvents.offer.tokenType,
              quantity: decodedEvents.offer.quantity.toString(),
            },
          };

          return formattedDecodedEvents;
        });

        const formattedData = await Promise.allSettled(
          eventResults.map(async (newOffer) => {
            try {
              if (!newOffer.assetContract || !newOffer.offer.tokenId)
                return null;

              const nft = await fetchNFT({
                assetContract: newOffer.assetContract,
                tokenId: newOffer.offer.tokenId,
              });
              return formatNewOffer(newOffer, nft);
            } catch (error) {
              console.error("Error formatting new offer data:", error);
              return null;
            }
          })
        );

        const validFormattedData = formattedData
          .filter(
            (result): result is PromiseFulfilledResult<any> =>
              result.status === "fulfilled" && result.value !== null
          )
          .map((result) => result.value);

        const filteredFormattedData = validFormattedData.filter((offer) => {
          const endTimeFormatted = new Date(
            offer.offer.expirationTimestamp
          ).getTime();
          const currentTime = new Date().getTime();

          const isExpired = currentTime > endTimeFormatted;

          return (
            (offer.offer.status === StatusType.CREATED && !isExpired) ||
            !isExpired
          );
        });

        return validFormattedData.slice(0, limit);
      } catch (error) {
        console.error("Error in useNewOfferEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data && !!limit,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    // refetchInterval: 5000,
  });
}
