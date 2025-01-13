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

const EventQueryLimit = 1000;

async function getEventArgs(event: any, blockHash: string) {
  const contract = getContractCustom({ contractAddress: MARKETPLACE_ADDRESS });

  const eventResult = await getContractEvents({
    contract,
    events: [event],
    blockHash: blockHash as Hex,
  });

  //   console.log({ eventResult });

  return eventResult[0].args;
}

export function useAllContractEventQuery() {
  return useQuery({
    queryKey: ["getAllContractEvent"],
    queryFn: async () => {
      const response = await axios.get<EventLog>(
        `${CROSSFI_API_URL}/event-logs?contractAddress=${MARKETPLACE_ADDRESS}&removed=false&page=1&limit=${EventQueryLimit}&sort=-blockNumber`
      );

      return response.data.docs;
    },
    staleTime: 1000 * 60 * 30, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 5 * 30, // Keep in cache for 5 minutes
  });
}

export function useCompletedListingEventQuery() {
  const allContractEventQuery = useAllContractEventQuery();

  console.log({ allContractEventQuery });

  return useQuery({
    queryKey: ["completed-listing-event"],
    queryFn: async () => {
      if (!allContractEventQuery.data) return;

      const completedListingEvent = await getCompletedListingEvent();
      console.log({ completedListingEvent });

      const eventLogs = allContractEventQuery.data;
      console.log({ eventLogs });

      const completedListingEvents = eventLogs
        .filter((event) => {
          return event.rawData.topics.some(
            (topic) =>
              topic.toLowerCase() ===
              completedListingEvent.topics[0].toLowerCase()
          );
        })
        .map((event) => event.blockHash);

      console.log({ completedListingEvents });

      const completedEventResults = await Promise.all(
        completedListingEvents.map(async (blockHash) => {
          const eventData = await getEventArgs(
            completedListingEvent,
            blockHash
          );
          return eventData as unknown as RawCompletedListingEvent;
        })
      );

      console.log({ completedEventResults });

      const formattedData = await Promise.all(
        completedEventResults.map(async (listing) => {
          const nft = await fetchNFT({
            assetContract: listing.assetContract,
            tokenId: listing.tokenId,
          });
          return formatCompletedListingSale(listing, nft);
        })
      );

      return formattedData;
    },
    enabled: !!allContractEventQuery.data,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 30, // 30 minutes
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    refetchInterval: 5000, // Refetch every 5 minutes
  });
}

export function useCompletedAuctionEventQuery() {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: ["completed-auction-event"],
    queryFn: async () => {
      if (!allContractEventQuery.data) return;

      const completedAuctionEvent = await getCompletedAuctionEvent();

      const eventLogs = allContractEventQuery.data;

      const completedAuctionEvents = eventLogs
        .filter((event) => {
          return event.rawData.topics.some(
            (topic) =>
              topic.toLowerCase() ===
              completedAuctionEvent.topics[0].toLowerCase()
          );
        })
        .map((event) => event.blockHash);

      const completedEventResults = await Promise.all(
        completedAuctionEvents.map(async (blockHash) => {
          const eventData = await getEventArgs(
            completedAuctionEvent,
            blockHash
          );

          return eventData as unknown as RawCompletedAuctionEvent;
        })
      );

      const updatedEventData = completedEventResults
        .filter(
          (event) =>
            event.closer.toLowerCase() === event.winningBidder.toLowerCase()
        )
        .filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.auctionId === event.auctionId)
        );

      const formattedData = await Promise.all(
        updatedEventData.map(async (auction) => {
          const nft = await fetchNFT({
            assetContract: auction.assetContract,
            tokenId: auction.tokenId,
          });
          return formatCompletedAuctionSale(auction, nft);
        })
      );

      return formattedData;
    },
    enabled: !!allContractEventQuery.data,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 30, // 30 minutes
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    refetchInterval: 5000, // Refetch every 5 minutes
  });
}

export function useAcceptedOfferEventQuery() {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: ["accepted-offer-event"],
    queryFn: async () => {
      if (!allContractEventQuery.data) return;

      const acceptedOfferEvent = await getAcceptedOfferEvent();

      const eventLogs = allContractEventQuery.data;

      const acceptedOfferEvents = eventLogs
        .filter((event) => {
          return event.rawData.topics.some(
            (topic) =>
              topic.toLowerCase() === acceptedOfferEvent.topics[0].toLowerCase()
          );
        })
        .map((event) => event.blockHash);

      const completedEventResults = await Promise.all(
        acceptedOfferEvents.map(async (blockHash) => {
          const eventData = await getEventArgs(acceptedOfferEvent, blockHash);

          return eventData as unknown as RawAcceptedOfferEvent;
        })
      );

      const formattedData = await Promise.all(
        completedEventResults.map(async (offer) => {
          const nft = await fetchNFT({
            assetContract: offer.assetContract,
            tokenId: offer.tokenId,
          });
          return formatAcceptedOffer(offer, nft);
        })
      );

      return formattedData;
    },
    enabled: !!allContractEventQuery.data,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 30, // 30 minutes
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    refetchInterval: 5000, // Refetch every 5 minutes
  });
}

export function useAuctionBidEventQuery() {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: ["auction-bid-event"],
    queryFn: async () => {
      if (!allContractEventQuery.data) return;

      const newAuctionEvent = await getNewAuctionBidEvent();

      const eventLogs = allContractEventQuery.data;

      const newAuctionBidEvent = eventLogs
        .filter((event) => {
          return event.rawData.topics.some(
            (topic) =>
              topic.toLowerCase() === newAuctionEvent.topics[0].toLowerCase()
          );
        })
        .map((event) => event.blockHash);

      const completedEventResults = await Promise.all(
        newAuctionBidEvent.map(async (blockHash) => {
          const eventData = await getEventArgs(newAuctionEvent, blockHash);

          return eventData as unknown as RawAuctionBidEvent;
        })
      );

      const formattedData = await Promise.all(
        completedEventResults.map(async (auctionBid) => {
          const nft = await fetchNFT({
            assetContract: auctionBid.assetContract,
            tokenId: auctionBid.auction.tokenId,
          });
          return formatNewAuctionBid(auctionBid, nft);
        })
      );

      const filteredFormattedData = formattedData.filter((auctionBid) => {
        return !(
          auctionBid.auction.isAuctionExpired ||
          auctionBid.auction.isAuctionActivityExpired
        );
      });

      return formattedData;
    },
    enabled: !!allContractEventQuery.data,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 30, // 30 minutes
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    refetchInterval: 5000, // Refetch every 5 minutes
  });
}

export function useNewOfferEventQuery() {
  const allContractEventQuery = useAllContractEventQuery();

  return useQuery({
    queryKey: ["new-offer-event"],
    queryFn: async () => {
      if (!allContractEventQuery.data) return;

      const newOfferEvent = await getNewOfferEvent();

      const eventLogs = allContractEventQuery.data;

      const newOfferBidEvent = eventLogs
        .filter((event) => {
          return event.rawData.topics.some(
            (topic) =>
              topic.toLowerCase() === newOfferEvent.topics[0].toLowerCase()
          );
        })
        .map((event) => event.blockHash);

      const completedEventResults = await Promise.all(
        newOfferBidEvent.map(async (blockHash) => {
          const eventData = await getEventArgs(newOfferEvent, blockHash);

          return eventData as unknown as RawOfferEvent;
        })
      );

      const formattedData = await Promise.all(
        completedEventResults.map(async (newOffer) => {
          const nft = await fetchNFT({
            assetContract: newOffer.assetContract,
            tokenId: newOffer.offer.tokenId,
          });
          return formatNewOffer(newOffer, nft);
        })
      );

      const filteredFormattedData = formattedData.filter((offer) => {
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

      return formattedData;
    },
    enabled: !!allContractEventQuery.data,
    // staleTime: 1000 * 60 * 5, // 5 minutes
    // gcTime: 1000 * 60 * 30, // 30 minutes
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    refetchInterval: 5000, // Refetch every 5 minutes
  });
}
