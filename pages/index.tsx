import Head from "next/head";
import { Hero, Sliders } from "@/modules/components/home";
import { usePromotedCollectionsQuery } from "@/modules/query";
import { cn } from "@/modules/app/utils";
// import {
//   useAllContractEventQuery,
//   useCompletedListingEventQuery,
//   useCompletedAuctionEventQuery,
//   useAcceptedOfferEventQuery,
//   // useAuctionBidEventQuery,
//   // useNewOfferEventQuery,
// } from "@/modules/query";

export default function Home() {
  // const contractAddress = "0x55babee194af5c59a5f17f9dea47be4a37dfb36d";

  // const { data: allContractEvent } = useAllContractEventQuery();
  // console.log({ allContractEvent });

  // const { data: completedListingEvent } = useCompletedListingEventQuery({});
  // console.log({ completedListingEvent });

  // const { data: completedAuctionEvent } = useCompletedAuctionEventQuery({});
  // console.log({ completedAuctionEvent });

  // const { data: acceptedOfferEvent } = useAcceptedOfferEventQuery({});
  // console.log({ acceptedOfferEvent });

  // const { data: auctionBidEvent } = useAuctionBidEventQuery({});
  // console.log({ auctionBidEvent });

  // const  { data: newOfferEvent } = useNewOfferEventQuery({});
  // console.log({ newOfferEvent });

  // const completedAuctionEvent = useCompletedAuctionEventQuery({});
  // console.log({ completedAuctionEvent });
  // const completedListingEvent = useCompletedListingEventQuery({});
  // console.log({ completedListingEvent });

  const { data: promotedCollections } = usePromotedCollectionsQuery();
  const hasPromotedCollections =
    !!promotedCollections && promotedCollections.length > 0;

  return (
    <div
      className={cn("h-full w-full pb-20", !hasPromotedCollections && "pt-20")}
    >
      <Head>
        <title>MintMingles Marketplace - Cross-Fi NFT Marketplace</title>
        <meta name="description" content={`Cross-Fi NFT Marketplace`} />
      </Head>
      <Hero />
      <Sliders />
    </div>
  );
}
