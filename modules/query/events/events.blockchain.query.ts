import { getContractCustom } from "@/modules/blockchain";
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

const EventQueryLimit = 1000;

async function getEventArgs(event: any, blockHash: string) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_ADDRESS });

  const eventResult = await getContractEvents({
    contract,
    events: [event],
    blockHash: blockHash as Hex,
  });

  return eventResult[0].args;
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
    staleTime: 1000 * 60 * 30, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5 * 30, // Keep in cache for 5 minutes
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
        const completedListingEvent = await getCompletedListingEvent();
        const eventLogs = allContractEventQuery.data;

        const completedListingEvents = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() === completedListingEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event.blockHash)
          .filter(Boolean);

        if (!completedListingEvents.length) return [];

        const completedEventResults = await Promise.allSettled(
          completedListingEvents.map(async (blockHash) => {
            try {
              const eventData = await getEventArgs(
                completedListingEvent,
                blockHash
              );
              return eventData as unknown as RawCompletedListingEvent;
            } catch (error) {
              console.error(`Error getting event args for block ${blockHash}:`, error);
              return null;
            }
          })
        );

        const validEventResults = completedEventResults
          .filter((result): result is PromiseFulfilledResult<RawCompletedListingEvent> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        const formattedData = await Promise.allSettled(
          validEventResults.map(async (listing) => {
            try {
              if (!listing?.assetContract || !listing?.tokenId) return null;
              
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
          .filter((result): result is PromiseFulfilledResult<any> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        if (contractAddress) {
          return validFormattedData.filter((data) => {
            return (
              data?.assetContract?.toLowerCase() === contractAddress.toLowerCase()
            );
          });
        } else {
          return validFormattedData.slice(0, limit);
        }
      } catch (error) {
        console.error("Error in useCompletedListingEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data && (!!limit || !!contractAddress),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
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
        const completedAuctionEvent = await getCompletedAuctionEvent();
        const eventLogs = allContractEventQuery.data;

        const completedAuctionEvents = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() === completedAuctionEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event.blockHash)
          .filter(Boolean);

        if (!completedAuctionEvents.length) return [];

        const completedEventResults = await Promise.allSettled(
          completedAuctionEvents.map(async (blockHash) => {
            try {
              const eventData = await getEventArgs(
                completedAuctionEvent,
                blockHash
              );
              return eventData as unknown as RawCompletedAuctionEvent;
            } catch (error) {
              console.error(`Error getting event args for block ${blockHash}:`, error);
              return null;
            }
          })
        );

        const validEventResults = completedEventResults
          .filter((result): result is PromiseFulfilledResult<RawCompletedAuctionEvent> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        const updatedEventData = validEventResults
          .filter(
            (event) =>
              event?.closer?.toLowerCase() === event?.winningBidder?.toLowerCase()
          )
          .filter(
            (event, index, self) =>
              index === self.findIndex((e) => e?.auctionId === event?.auctionId)
          );

        const formattedData = await Promise.allSettled(
          updatedEventData.map(async (auction) => {
            try {
              if (!auction?.assetContract || !auction?.tokenId) return null;
              
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
          .filter((result): result is PromiseFulfilledResult<any> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        if (contractAddress) {
          return validFormattedData.filter((data) => {
            return (
              data?.assetContract?.toLowerCase() === contractAddress.toLowerCase()
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
    refetchInterval: 5000,
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
                  topic?.toLowerCase() === acceptedOfferEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event.blockHash)
          .filter(Boolean);

        if (!acceptedOfferEvents.length) return [];

        const completedEventResults = await Promise.allSettled(
          acceptedOfferEvents.map(async (blockHash) => {
            try {
              const eventData = await getEventArgs(acceptedOfferEvent, blockHash);
              return eventData as unknown as RawAcceptedOfferEvent;
            } catch (error) {
              console.error(`Error getting event args for block ${blockHash}:`, error);
              return null;
            }
          })
        );

        const validEventResults = completedEventResults
          .filter((result): result is PromiseFulfilledResult<RawAcceptedOfferEvent> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        const formattedData = await Promise.allSettled(
          validEventResults.map(async (offer) => {
            try {
              if (!offer?.assetContract || !offer?.tokenId) return null;
              
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
          .filter((result): result is PromiseFulfilledResult<any> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        return validFormattedData.slice(0, limit);
      } catch (error) {
        console.error("Error in useAcceptedOfferEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data && !!limit,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useAuctionBidEventQuery({ limit = 50 }: { limit?: number }) {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: [queryKeys.events.auctionBid, { limit }],
    queryFn: async () => {
      if (!allContractEventQuery.data) return [];

      try {
        const newAuctionEvent = await getNewAuctionBidEvent();
        const eventLogs = allContractEventQuery.data;

        const newAuctionBidEvent = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() === newAuctionEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event.blockHash)
          .filter(Boolean);

        if (!newAuctionBidEvent.length) return [];

        const completedEventResults = await Promise.allSettled(
          newAuctionBidEvent.map(async (blockHash) => {
            try {
              const eventData = await getEventArgs(newAuctionEvent, blockHash);
              return eventData as unknown as RawAuctionBidEvent;
            } catch (error) {
              console.error(`Error getting event args for block ${blockHash}:`, error);
              return null;
            }
          })
        );

        const validEventResults = completedEventResults
          .filter((result): result is PromiseFulfilledResult<RawAuctionBidEvent> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        const formattedData = await Promise.allSettled(
          validEventResults.map(async (auctionBid) => {
            try {
              if (!auctionBid?.assetContract || !auctionBid?.auction?.tokenId) return null;
              
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
          .filter((result): result is PromiseFulfilledResult<any> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        const filteredFormattedData = validFormattedData.filter((auctionBid) => {
          return !(
            auctionBid.auction.isAuctionExpired ||
            auctionBid.auction.isAuctionActivityExpired
          );
        });

        return filteredFormattedData.slice(0, limit);
      } catch (error) {
        console.error("Error in useAuctionBidEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data && !!limit,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}

export function useNewOfferEventQuery() {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: [queryKeys.events.newOffer],
    queryFn: async () => {
      if (!allContractEventQuery.data) return [];

      try {
        const newOfferEvent = await getNewOfferEvent();
        const eventLogs = allContractEventQuery.data;

        const newOfferBidEvent = eventLogs
          .filter((event) => {
            try {
              return event.rawData.topics.some(
                (topic) =>
                  topic?.toLowerCase() === newOfferEvent.topics[0]?.toLowerCase()
              );
            } catch (error) {
              console.error("Error filtering event topics:", error);
              return false;
            }
          })
          .map((event) => event.blockHash)
          .filter(Boolean);

        if (!newOfferBidEvent.length) return [];

        const completedEventResults = await Promise.allSettled(
          newOfferBidEvent.map(async (blockHash) => {
            try {
              const eventData = await getEventArgs(newOfferEvent, blockHash);
              return eventData as unknown as RawOfferEvent;
            } catch (error) {
              console.error(`Error getting event args for block ${blockHash}:`, error);
              return null;
            }
          })
        );

        const validEventResults = completedEventResults
          .filter((result): result is PromiseFulfilledResult<RawOfferEvent> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

        const formattedData = await Promise.allSettled(
          validEventResults.map(async (newOffer) => {
            try {
              if (!newOffer?.assetContract || !newOffer?.offer?.tokenId) return null;
              
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
          .filter((result): result is PromiseFulfilledResult<any> => 
            result.status === 'fulfilled' && result.value !== null
          )
          .map(result => result.value);

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

        return filteredFormattedData;
      } catch (error) {
        console.error("Error in useNewOfferEventQuery:", error);
        return [];
      }
    },
    enabled: !!allContractEventQuery.data,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 5000,
  });
}
