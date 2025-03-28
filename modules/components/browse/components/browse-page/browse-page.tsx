// import React, { useEffect, useState } from "react";
// import {
//   useAcceptedOfferEventQuery,
//   useAllAuctionsBlockchainQuery,
//   useAllListingBlockchainQuery,
//   useAllOffersBlockchainQuery,
//   useAuctionBidEventQuery,
//   useCompletedAuctionEventQuery,
//   useCompletedListingEventQuery,
// } from "@/modules/query";
// import { EmptyState, ErrorComponent, Header, NFTCard } from "@/modules/app";
// import { motion } from "framer-motion";
// import { AllListingTable } from "../table/all-listing";
// import { AllAuctionTable } from "../table/all-auction";
// import { AllOffersTable } from "../table/all-offers";
// import { Pagination } from "@/modules/app/component/pagination";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   Listing,
//   Offer,
//   Auction,
//   CompletedListingEvent,
//   CompletedAuctionEvent,
//   AcceptedOfferEvent,
//   AuctionBidEvent,
// } from "@/modules/query/utils";
// import { CompletedListingTable } from "../table/completed-listing";
// import { CompletedAuctionTable } from "../table/completed-auction";
// import { AcceptedOfferTable } from "../table/accepted-offers";
// import { AuctionBidsTable } from "../table/auction-bids";

// export const browsePageFilters = [
//   "All Listings",
//   "All Auctions",
//   "All Offers",
//   "Completed Listing",
//   "Completed Auction",
//   "Accepted Offers",
//   "Auction Bids",
// ];

// export enum QueryBrowsePageFilters {
//   ALL_LISTINGS = "all_listings",
//   ALL_AUCTIONS = "all_auctions",
//   ALL_OFFERS = "all_offers",
//   COMPLETED_LISTING = "completed_listing",
//   COMPLETED_AUCTION = "completed_auction",
//   ACCEPTED_OFFERS = "accepted_offers",
//   AUCTION_BIDS = "auction_bids",
// }

// export function BrowsePage() {
//   const router = useRouter();
//   const [isActive, setIsActive] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedFilter, setSelectedFilter] = useState("");

//   const searchParams = useSearchParams();
//   const currentFilter = searchParams.get("filter") || "";

//   const itemsPerPage = 5;
//   const fetchLimit = 50;

//   const {
//     data: allListings,
//     isLoading: isAllListingsLoading,
//     isError: isAllListingsError,
//   } = useAllListingBlockchainQuery({
//     limit: fetchLimit,
//     type: "live-listing",
//   });

//   const {
//     data: allAuctions,
//     isLoading: isAllAuctionsLoading,
//     isError: isAllAuctionsError,
//   } = useAllAuctionsBlockchainQuery({
//     limit: fetchLimit,
//     type: "live-auction",
//   });

//   const {
//     data: allOffers,
//     isLoading: isAllOffersLoading,
//     isError: isAllOffersError,
//   } = useAllOffersBlockchainQuery({
//     limit: fetchLimit,
//     type: "live-offer",
//   });

//   const {
//     data: completedListingEventQuery,
//     isLoading: isLoadingCompletedListing,
//     isError: isErrorCompletedListing,
//   } = useCompletedListingEventQuery({
//     limit: fetchLimit,
//   });

//   const {
//     data: completedAuctionEventQuery,
//     isLoading: isLoadingCompletedAuction,
//     isError: isErrorCompletedAuction,
//   } = useCompletedAuctionEventQuery({
//     limit: fetchLimit,
//   });

//   const {
//     data: acceptedOfferEventQuery,
//     isLoading: isLoadingAcceptedOffer,
//     isError: isErrorAcceptedOffer,
//   } = useAcceptedOfferEventQuery({
//     limit: fetchLimit,
//   });

//   const {
//     data: auctionBidEventQuery,
//     isLoading: isLoadingAuctionBidEvent,
//     isError: isErrorAuctionBidEvent,
//   } = useAuctionBidEventQuery({
//     limit: fetchLimit,
//   });

//   const isError =
//     isAllListingsError ||
//     isAllOffersError ||
//     isAllAuctionsError ||
//     isErrorCompletedListing ||
//     isErrorCompletedAuction ||
//     isErrorAuctionBidEvent ||
//     isErrorAcceptedOffer;

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handleFilterClick = (filter: string) => {
//     // if (filter) setSelectedFilter(filter);
//     if (filter) {
//       setSelectedFilter(filter);
//       const queryFilter = filter.toLowerCase().replace(/\s+/g, "_");
//       router.push(`/browse?filter=${queryFilter}`);
//     }
//   };

//   const getFilteredData = () => {
//     switch (selectedFilter) {
//       case browsePageFilters[0]:
//         const filteredAllListings =
//           allListings?.filter((listing) => {
//             const searchTerm = searchQuery
//               .toLowerCase()
//               .trim()
//               .replace(/\s+/g, "");
//             const nameNoSpace = listing?.nft?.metadata?.name
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const tokenIdNoSpace = listing.tokenId
//               .toString()
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

//             return combinedField.includes(searchTerm);
//           }) ?? [];

//         return filteredAllListings as Listing[];

//       case browsePageFilters[1]:
//         const filteredAllAuctions =
//           allAuctions?.filter((auction) => {
//             const searchTerm = searchQuery
//               .toLowerCase()
//               .trim()
//               .replace(/\s+/g, "");
//             const nameNoSpace = auction?.nft?.metadata?.name
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const tokenIdNoSpace = auction.tokenId
//               .toString()
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

//             return combinedField.includes(searchTerm);
//           }) ?? [];

//         return filteredAllAuctions as Auction[];

//       case browsePageFilters[2]:
//         const filteredAllOffers = allOffers?.filter((auction) => {
//           const searchTerm = searchQuery
//             .toLowerCase()
//             .trim()
//             .replace(/\s+/g, "");

//           const nameNoSpace = auction?.nft?.metadata?.name
//             ?.toLowerCase()
//             ?.replace(/\s+/g, "");
//           const tokenIdNoSpace = auction?.tokenId
//             .toString()
//             ?.toLowerCase()
//             ?.replace(/\s+/g, "");
//           const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

//           return combinedField.includes(searchTerm);
//         });

//         return filteredAllOffers as Offer[];

//       case browsePageFilters[3]:
//         const filteredCompletedListing = completedListingEventQuery?.filter(
//           (completedListing) => {
//             const searchTerm = searchQuery
//               .toLowerCase()
//               .trim()
//               .replace(/\s+/g, "");

//             const nameNoSpace = completedListing?.nft?.metadata?.name
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const tokenIdNoSpace = completedListing?.tokenId
//               .toString()
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

//             return combinedField.includes(searchTerm);
//           }
//         );

//         return filteredCompletedListing as CompletedListingEvent[];

//       case browsePageFilters[4]:
//         const filteredCompletedAuction = completedAuctionEventQuery?.filter(
//           (completedAuction) => {
//             const searchTerm = searchQuery
//               .toLowerCase()
//               .trim()
//               .replace(/\s+/g, "");

//             const nameNoSpace = completedAuction?.nft?.metadata?.name
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const tokenIdNoSpace = completedAuction?.tokenId
//               .toString()
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

//             return combinedField.includes(searchTerm);
//           }
//         );

//         return filteredCompletedAuction as CompletedAuctionEvent[];

//       case browsePageFilters[5]:
//         const filteredAcceptedOffers = acceptedOfferEventQuery?.filter(
//           (acceptedOffer) => {
//             const searchTerm = searchQuery
//               .toLowerCase()
//               .trim()
//               .replace(/\s+/g, "");

//             const nameNoSpace = acceptedOffer?.nft?.metadata?.name
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const tokenIdNoSpace = acceptedOffer?.tokenId
//               .toString()
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

//             return combinedField.includes(searchTerm);
//           }
//         );

//         return filteredAcceptedOffers as AcceptedOfferEvent[];

//       case browsePageFilters[6]:
//         const filteredAuctionBids = auctionBidEventQuery?.filter(
//           (auctionBids) => {
//             const searchTerm = searchQuery
//               .toLowerCase()
//               .trim()
//               .replace(/\s+/g, "");

//             const nameNoSpace = auctionBids.auction.nft.metadata?.name
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const tokenIdNoSpace = auctionBids.auction.tokenId
//               .toString()
//               ?.toLowerCase()
//               ?.replace(/\s+/g, "");
//             const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

//             return combinedField.includes(searchTerm);
//           }
//         );

//         return filteredAuctionBids as AuctionBidEvent[];

//       default:
//         return null;
//     }
//   };

//   const filteredData = getFilteredData();

//   const totalCount = filteredData?.length || 0;
//   const totalPages = Math.ceil(totalCount / itemsPerPage);
//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentPageData = filteredData?.slice(startIndex, endIndex);

//   const handlePageChange = (pageNum: number) => {
//     setCurrentPage(pageNum);
//     window.scrollTo(0, 0);
//   };

//   const handleViewItem = ({
//     contractAddress,
//     tokenId,
//   }: {
//     contractAddress: string;
//     tokenId: string;
//   }) => {
//     router.push(`/nft/${contractAddress}/${tokenId}`);
//   };

//   useEffect(() => {
//     if (currentFilter) {
//       const matchingFilter = browsePageFilters.find(
//         (browsePageFilters) =>
//           browsePageFilters.toLowerCase().replace(/\s+/g, "_") === currentFilter
//       );
//       if (matchingFilter) {
//         setSelectedFilter(matchingFilter);
//       }
//     } else {
//       setSelectedFilter(browsePageFilters[0]);
//     }
//   }, [currentFilter]);

//   if (isError) {
//     return <ErrorComponent />;
//   }

//   return (
//     <div className="pt-[17px]">
//       <Header
//         isActive={isActive}
//         setIsActive={setIsActive}
//         searchQuery={searchQuery}
//         handleSearch={handleSearch}
//         onFilterClick={handleFilterClick}
//         filters={browsePageFilters}
//         showFilters
//       />
//       {/* Conditionally render based on selectedFilter */}
//       <div className="mt-8 w-full">
//         {/* All Listings */}
//         {selectedFilter === browsePageFilters[0] && (
//           <motion.div>
//             {currentPageData && currentPageData.length > 0 ? (
//               <>
//                 {!isActive ? (
//                   <AllListingTable
//                     isLoading={isAllListingsLoading}
//                     data={currentPageData as Listing[]}
//                   />
//                 ) : (
//                   <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
//                     {currentPageData?.map((listing, index) => {
//                       const data = listing as Listing;
//                       return (
//                         <NFTCard
//                           key={index}
//                           data={data}
//                           nft={data.nft}
//                           type="listing"
//                           cta="View Item"
//                           extraCTA="Buy Now"
//                           status="listed"
//                           onClick={() => {
//                             handleViewItem({
//                               contractAddress: data.assetContract,
//                               tokenId: data.tokenId.toString(),
//                             });
//                           }}
//                         />
//                       );
//                     })}
//                   </div>
//                 )}
//                 <div className="mt-8">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               </>
//             ) : (
//               <EmptyState
//                 message={
//                   searchQuery.length > 0
//                     ? "No items found according to your search"
//                     : "No listings found"
//                 }
//               />
//             )}
//           </motion.div>
//         )}
//         {/* All Auctions */}
//         {selectedFilter === browsePageFilters[1] && (
//           <>
//             {currentPageData && currentPageData.length > 0 ? (
//               <>
//                 {!isActive ? (
//                   <AllAuctionTable
//                     isLoading={isAllAuctionsLoading}
//                     data={currentPageData as Auction[]}
//                   />
//                 ) : (
//                   <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
//                     {currentPageData?.map((auction, index) => {
//                       const data = auction as Auction;
//                       return (
//                         <NFTCard
//                           key={index}
//                           data={data}
//                           nft={data.nft}
//                           type="auction"
//                           cta="View Item"
//                           extraCTA="Buy Auction"
//                           status="auctioned"
//                           onClick={() => {
//                             handleViewItem({
//                               contractAddress: data.assetContract,
//                               tokenId: data.tokenId.toString(),
//                             });
//                           }}
//                         />
//                       );
//                     })}
//                   </div>
//                 )}
//                 <div className="mt-8">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               </>
//             ) : (
//               <EmptyState
//                 message={
//                   searchQuery.length > 0
//                     ? "No items found according to your search"
//                     : "No auctions found"
//                 }
//               />
//             )}
//           </>
//         )}
//         {/* All Offers */}
//         {selectedFilter === browsePageFilters[2] && (
//           <>
//             {currentPageData && currentPageData.length > 0 ? (
//               <>
//                 {!isActive ? (
//                   <AllOffersTable
//                     isLoading={isAllOffersLoading}
//                     data={currentPageData as Offer[]}
//                   />
//                 ) : (
//                   <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
//                     {currentPageData?.map((offers, index) => {
//                       const data = offers as Offer;
//                       return (
//                         <NFTCard
//                           key={index}
//                           data={data}
//                           nft={data.nft}
//                           type="offers"
//                           cta="View Item"
//                           onClick={() => {
//                             handleViewItem({
//                               contractAddress: data.assetContract,
//                               tokenId: data.tokenId.toString(),
//                             });
//                           }}
//                         />
//                       );
//                     })}
//                   </div>
//                 )}
//                 <div className="mt-8">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               </>
//             ) : (
//               <EmptyState
//                 message={
//                   searchQuery.length > 0
//                     ? "No items found according to your search"
//                     : "No offers found"
//                 }
//               />
//             )}
//           </>
//         )}
//         {/* Completed Listing */}
//         {selectedFilter === browsePageFilters[3] && (
//           <>
//             {currentPageData && currentPageData.length > 0 ? (
//               <>
//                 {!isActive ? (
//                   <CompletedListingTable
//                     isLoading={isLoadingCompletedListing}
//                     data={currentPageData as CompletedListingEvent[]}
//                   />
//                 ) : (
//                   <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
//                     {currentPageData?.map((completedListing, index) => {
//                       const data = completedListing as CompletedListingEvent;
//                       return (
//                         <NFTCard
//                           key={index}
//                           data={data}
//                           nft={data.nft}
//                           type="completed-listing"
//                           cta="View Item"
//                           onClick={() => {
//                             handleViewItem({
//                               contractAddress: data.assetContract,
//                               tokenId: data.tokenId.toString(),
//                             });
//                           }}
//                         />
//                       );
//                     })}
//                   </div>
//                 )}
//                 <div className="mt-8">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               </>
//             ) : (
//               <EmptyState
//                 message={
//                   searchQuery.length > 0
//                     ? "No items found according to your search"
//                     : "No completed listing found"
//                 }
//               />
//             )}
//           </>
//         )}
//         {/* Completed Auction */}
//         {selectedFilter === browsePageFilters[4] && (
//           <>
//             {currentPageData && currentPageData.length > 0 ? (
//               <>
//                 {!isActive ? (
//                   <CompletedAuctionTable
//                     isLoading={isLoadingCompletedAuction}
//                     data={currentPageData as CompletedAuctionEvent[]}
//                   />
//                 ) : (
//                   <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
//                     {currentPageData?.map((completedAuction, index) => {
//                       const data = completedAuction as CompletedAuctionEvent;
//                       return (
//                         <NFTCard
//                           key={index}
//                           data={data}
//                           nft={data.nft}
//                           type="completed-auction"
//                           cta="View Item"
//                           onClick={() => {
//                             handleViewItem({
//                               contractAddress: data.assetContract,
//                               tokenId: data.tokenId.toString(),
//                             });
//                           }}
//                         />
//                       );
//                     })}
//                   </div>
//                 )}
//                 <div className="mt-8">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               </>
//             ) : (
//               <EmptyState
//                 message={
//                   searchQuery.length > 0
//                     ? "No items found according to your search"
//                     : "No completed auction found"
//                 }
//               />
//             )}
//           </>
//         )}
//         {/* Accepted Offer */}
//         {selectedFilter === browsePageFilters[5] && (
//           <>
//             {currentPageData && currentPageData.length > 0 ? (
//               <>
//                 {!isActive ? (
//                   <AcceptedOfferTable
//                     isLoading={isLoadingAcceptedOffer}
//                     data={currentPageData as AcceptedOfferEvent[]}
//                   />
//                 ) : (
//                   <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
//                     {currentPageData?.map((acceptedOffer, index) => {
//                       const data = acceptedOffer as AcceptedOfferEvent;
//                       return (
//                         <NFTCard
//                           key={index}
//                           data={data}
//                           nft={data.nft}
//                           type="accepted-offers"
//                           cta="View Item"
//                           onClick={() => {
//                             handleViewItem({
//                               contractAddress: data.assetContract,
//                               tokenId: data.tokenId.toString(),
//                             });
//                           }}
//                         />
//                       );
//                     })}
//                   </div>
//                 )}
//                 <div className="mt-8">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               </>
//             ) : (
//               <EmptyState
//                 message={
//                   searchQuery.length > 0
//                     ? "No items found according to your search"
//                     : "No accepted offer found"
//                 }
//               />
//             )}
//           </>
//         )}
//         {/* Auction Bids Offer */}
//         {selectedFilter === browsePageFilters[6] && (
//           <>
//             {currentPageData && currentPageData.length > 0 ? (
//               <>
//                 {!isActive ? (
//                   <AuctionBidsTable
//                     isLoading={isLoadingAuctionBidEvent}
//                     data={currentPageData as AuctionBidEvent[]}
//                   />
//                 ) : (
//                   <div className="w-full max-sm:flex flex-col items-center justify-center grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-2 place-content-center gap-5">
//                     {currentPageData?.map((auctionBid, index) => {
//                       const data = auctionBid as AuctionBidEvent;
//                       return (
//                         <NFTCard
//                           key={index}
//                           data={data}
//                           nft={data.auction.nft}
//                           type="auction-bids"
//                           cta="View Item"
//                           onClick={() => {
//                             handleViewItem({
//                               contractAddress: auctionBid.assetContract,
//                               tokenId: data.auction.tokenId.toString(),
//                             });
//                           }}
//                         />
//                       );
//                     })}
//                   </div>
//                 )}
//                 <div className="mt-8">
//                   <Pagination
//                     currentPage={currentPage}
//                     totalPages={totalPages}
//                     onPageChange={handlePageChange}
//                   />
//                 </div>
//               </>
//             ) : (
//               <EmptyState
//                 message={
//                   searchQuery.length > 0
//                     ? "No items found according to your search"
//                     : "No auction bids found"
//                 }
//               />
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
