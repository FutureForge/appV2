import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getFormatAddress } from "@/utils/functions";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useInView } from "react-intersection-observer";
import {
  useUserAuctionsQuery,
  useUserBidsQuery,
  useUserChainInfo,
  useUserCollectionsQuery,
  useUserExpiredAuctionsQuery,
  useUserExpiredListingsQuery,
  useUserExpiredOffersQuery,
  useUserListingsQuery,
  useUserNFTActivitiesQuery,
  useUserNFTsQuery,
  useUserOffersQuery,
  useUserOffersReceivedQuery,
} from "@/modules/query";
import {
  useCancelAuctionMutation,
  useCancelDirectListingMutation,
  useCancelOfferMutation,
} from "@/modules/mutation";
import {
  Checkbox,
  EmptyState,
  Header,
  NFTCard,
  NftCardSkeleton,
} from "@/modules/app";

import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";

import { motion } from "framer-motion";
import {
  CollectionsNFTCard,
  ImageHolder,
} from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import {
  Collection,
  UserNFTData,
} from "@/utils/types/collection/collection.type";
import { Auction, Listing, NewBid, Offer } from "@/utils/types/graphql";
import { chainInfo, client } from "@/utils/configs";
import { ITEMS_PER_PAGE } from "@/pages/collections/[collectionAddress]";
import { useUserImageStore } from "@/utils/store/user-image.store";

// Icons
import CopyIcon from "@/assets/copy.svg";
import LinkIcon from "@/assets/link-external-02.svg";

const filters = [
  "NFTS",
  "Listed",
  "Auctions",
  "Offers Made",
  "Offers Received",
  "Bids Placed",
  "NFT Activities",
  "Expired",
  "Collections",
];

const options = [
  "Expired Listing",
  "Expired Auction",
  "Expired Offer",
] as const;

export function ProfilePage() {
  const router = useRouter();
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const { backgroundImage } = useUserImageStore();

  const cancelListingMutation = useCancelDirectListingMutation();
  const cancelAuctionMutation = useCancelAuctionMutation();
  const cancelOfferMutation = useCancelOfferMutation();

  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [selectedOption, setSelectedOption] = useState<
    "Expired Listing" | "Expired Auction" | "Expired Offer"
  >(options[0]);

  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
    delay: 100,
  });

  const {
    data: userNFTs,
    isLoading: isUserNFTsLoading,
    isPending: isUserNFTsPending,
  } = useUserNFTsQuery();
  const {
    data: userListings,
    isLoading: isUserListingsLoading,
    isPending: isUserListingsPending,
  } = useUserListingsQuery();
  const {
    data: userAuctions,
    isLoading: isUserAuctionsLoading,
    isPending: isUserAuctionsPending,
  } = useUserAuctionsQuery();
  const {
    data: userOffers,
    isLoading: isUserOffersLoading,
    isPending: isUserOffersPending,
  } = useUserOffersQuery();
  const {
    data: userOffersReceived,
    isLoading: isUserOffersReceivedLoading,
    isPending: isUserOffersReceivedPending,
  } = useUserOffersReceivedQuery();
  const {
    data: userBids,
    isLoading: isUserBidsLoading,
    isPending: isUserBidsPending,
  } = useUserBidsQuery();
  const {
    data: userExpiredListings,
    isLoading: isUserExpiredListingsLoading,
    isPending: isUserExpiredListingsPending,
  } = useUserExpiredListingsQuery();
  const {
    data: userExpiredAuctions,
    isLoading: isUserExpiredAuctionsLoading,
    isPending: isUserExpiredAuctionsPending,
  } = useUserExpiredAuctionsQuery();
  const {
    data: userExpiredOffers,
    isLoading: isUserExpiredOffersLoading,
    isPending: isUserExpiredOffersPending,
  } = useUserExpiredOffersQuery();
  const {
    data: userCollections,
    isLoading: isUserCollectionsLoading,
    isPending: isUserCollectionsPending,
  } = useUserCollectionsQuery();
  const {
    data: userNFTActivities,
    isLoading: isUserNFTActivitiesLoading,
    isPending: isUserNFTActivitiesPending,
  } = useUserNFTActivitiesQuery();

  const copyToClipboard = useCopyToClipboard()[1];
  const handleCopy = (content: string) => {
    if (content) {
      copyToClipboard(content);
    }
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterClick = (filter: string) => {
    if (filter) setSelectedFilter(filter);
  };

  const handleViewItemClick = ({
    contractAddress,
    tokenId,
  }: {
    contractAddress: string;
    tokenId: string;
  }) => {
    router.push(`/nft/${contractAddress}/${tokenId}`);
  };

  const handleCancelListing = ({ listingId }: { listingId: string }) => {
    if (!listingId) return;

    cancelListingMutation.mutate({ listingId });
  };

  const handleCancelAuction = ({ auctionId }: { auctionId: string }) => {
    if (!auctionId) return;

    cancelAuctionMutation.mutate({ auctionId });
  };

  const handleCancelOffer = ({ offerId }: { offerId: string }) => {
    if (!offerId) return;

    cancelOfferMutation.mutate({ offerId });
  };

  const isDisabled =
    cancelListingMutation.isPending ||
    cancelAuctionMutation.isPending ||
    cancelOfferMutation.isPending;

  const getFilteredData = () => {
    switch (selectedFilter) {
      case filters[0]:
        const filteredAllNFTs = userNFTs?.filter((nft) => {
          if (!nft?.nft?.metadata?.name) return false;

          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = nft?.nft?.metadata?.name
            .toLowerCase()
            .replace(/\s+/g, "");
          const tokenIdNoSpace = nft.tokenId
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });

        return filteredAllNFTs;

      case filters[1]:
        const filteredListedNFTs = userListings?.userListings?.filter(
          (listing) => {
            const searchTerm = searchQuery
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "");

            const nameNoSpace = listing?.nft?.metadata?.name
              .toLowerCase()
              .replace(/\s+/g, "");
            const tokenIdNoSpace = listing.tokenId
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "");
            const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

            return combinedField.includes(searchTerm);
          }
        );

        return filteredListedNFTs;

      case filters[2]:
        const filteredAuctions = userAuctions?.userAuctions?.filter(
          (auction) => {
            const searchTerm = searchQuery
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "");

            const nameNoSpace = auction?.nft?.metadata?.name
              .toLowerCase()
              .replace(/\s+/g, "");
            const tokenIdNoSpace = auction.tokenId
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "");
            const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

            return combinedField.includes(searchTerm);
          }
        );
        return filteredAuctions;

      case filters[3]:
        const filteredOffers = userOffers?.userOffers?.filter((offer) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = offer?.nft?.metadata?.name
            .toLowerCase()
            .replace(/\s+/g, "");
          const tokenIdNoSpace = offer.tokenId
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });
        return filteredOffers;

      case filters[4]:
        const filteredOffersReceived =
          userOffersReceived?.userOffersReceived?.filter((offer) => {
            const searchTerm = searchQuery
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "");

            const nameNoSpace = offer?.nft?.metadata?.name
              .toLowerCase()
              .replace(/\s+/g, "");
            const tokenIdNoSpace = offer.tokenId
              .toString()
              .toLowerCase()
              .replace(/\s+/g, "");
            const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

            return combinedField.includes(searchTerm);
          });
        return filteredOffersReceived;

      case filters[5]:
        const filteredBids = userBids?.userBids?.filter((bid) => {
          const searchTerm = searchQuery
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "");

          const nameNoSpace = bid?.nft?.metadata?.name
            .toLowerCase()
            .replace(/\s+/g, "");
          const tokenIdNoSpace = bid.tokenId
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "");
          const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

          return combinedField.includes(searchTerm);
        });
        return filteredBids;

      default:
        return [];
    }
  };

  const filteredData = getFilteredData();
  const paginatedData = filteredData?.slice(0, displayCount);
  const expiredListings = userExpiredListings?.expiredListings;
  const expiredAuctions = userExpiredAuctions?.expiredAuctions;
  const expiredOffers = userExpiredOffers?.expiredOffers;

  const paginatedCollectionsData = userCollections?.slice(0, displayCount);
  const paginatedNFTActivitiesData = userNFTActivities?.slice(0, displayCount);
  const paginatedExpiredListingsData = expiredListings?.slice(0, displayCount);
  const paginatedExpiredAuctionsData = expiredAuctions?.slice(0, displayCount);
  const paginatedExpiredOffersData = expiredOffers?.slice(0, displayCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (inView && filteredData && filteredData.length > displayCount) {
      const timeoutId = setTimeout(() => {
        setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [
    inView,
    filteredData,
    paginatedData,
    expiredAuctions,
    expiredListings,
    expiredOffers,
    displayCount,
  ]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedFilter, selectedOption]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-20 w-full min-h-screen pb-20">
      <Head>
        <title>Mint Mingle - Profile</title>
        <meta name="description" content={`View your profile on Mint Mingle`} />
      </Head>
      <div className="h-[395px] relative w-full px-[35px] py-10 flex items-end">
        <Image
          src={"/profile-bg.png"}
          alt={"profile background image"}
          layout="fill"
          quality={100}
          priority
          className="w-full h-full object-cover rounded-3xl"
        />
        <div className="bg-gradient-to-tr from-background via-background/95 to-transparent absolute inset-0 z-10" />
        <div className="z-40 flex items-end justify-between w-full">
          <div className="z-30 flex flex-col gap-6 w-[40%]">
            <div className="flex flex-col gap-4 z-40">
              {/* <Image
                src={"/image-2.png"}
                alt={"profile image"}
                width={123}
                height={123}
                className="size-[123px] rounded-[22px] z-40"
              /> */}
              <div
                className="size-[123px] rounded-[22px] z-40"
                style={{
                  background: backgroundImage,
                }}
              />
              {userAddress && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <h4 className="text-2xl max-md:text-lg font-medium flex gap-2 items-center">
                    {getFormatAddress(userAddress || "")}
                  </h4>
                  <CopyIcon
                    onClick={() => handleCopy(userAddress)}
                    className="size-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-300 ease-in-out"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 flex flex-col gap-8 min-h-screen w-full">
        <div className="flex items-center w-full justify-between gap-6 flex-col">
          <Header
            isActive={isActive}
            setIsActive={setIsActive}
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            onFilterClick={handleFilterClick}
            filters={filters}
            showRightSide={false}
          />
          <div className="w-full items-center flex justify-end flex-wrap">
            {selectedFilter === filters[7] && (
              <div className="flex items-center flex-wrap gap-4 whitespace-nowrap">
                {options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-2"
                    onClick={() => setSelectedOption(option)}
                  >
                    <Checkbox
                      checked={selectedOption === option}
                      onCheckedChange={() => setSelectedOption(option)}
                    />
                    <label
                      className={
                        selectedOption === option
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {userAddress ? (
          <div className="flex flex-wrap items-center gap-6 w-full">
            {/* User NFTS */}
            {selectedFilter === filters[0] && (
              <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                {isUserNFTsLoading || isUserNFTsPending ? (
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                    {Array.from({ length: 4 }, (_, index) => (
                      <NftCardSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredData &&
                  paginatedData &&
                  paginatedData.length > 0 ? (
                  <>
                    {paginatedData?.map((nft) => {
                      // @ts-ignore
                      const data = nft as UserNFTData;
                      return <CustomNFTCard key={nft.tokenId} data={data} />;
                    })}
                    {filteredData?.length > displayCount && (
                      <div
                        ref={loadMoreRef}
                        className="w-full h-20 col-span-full"
                        style={{ gridColumn: "1 / -1" }}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    message={
                      searchQuery.length > 0 ? "No NFTs found" : "No NFTs"
                    }
                  />
                )}
              </div>
            )}

            {/* Listed NFTS */}
            {selectedFilter === filters[1] && (
              <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                {isUserListingsLoading || isUserListingsPending ? (
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                    {Array.from({ length: 4 }, (_, index) => (
                      <NftCardSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredData &&
                  paginatedData &&
                  paginatedData.length > 0 ? (
                  <>
                    {paginatedData?.map((listing, index) => {
                      const data = listing as Listing;
                      return (
                        <NFTCard
                          key={index}
                          data={data}
                          type="user-listing"
                          cta="View Item"
                          onClick={() => {
                            handleViewItemClick({
                              contractAddress: data.assetContract,
                              tokenId: data.tokenId,
                            });
                          }}
                          actionCTA="Cancel Listing"
                          actionOnClick={() => {
                            handleCancelListing({
                              listingId: data.listingId,
                            });
                          }}
                          isDisabled={isDisabled}
                        />
                      );
                    })}
                    {filteredData?.length > displayCount && (
                      <div
                        ref={loadMoreRef}
                        className="w-full h-20 col-span-full"
                        style={{ gridColumn: "1 / -1" }}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    message={
                      searchQuery.length > 0 ? "No NFTs found" : "No NFT Listed"
                    }
                  />
                )}
              </div>
            )}

            {/* Auctioned NFTS */}
            {selectedFilter === filters[2] && (
              <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                {isUserAuctionsLoading || isUserAuctionsPending ? (
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                    {Array.from({ length: 4 }, (_, index) => (
                      <NftCardSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredData &&
                  paginatedData &&
                  paginatedData.length > 0 ? (
                  <>
                    {paginatedData?.map((auction, index) => {
                      console.log({ auction });
                      const data = auction as Auction;
                      return (
                        <NFTCard
                          key={index}
                          data={data}
                          type="user-auction"
                          cta="View Item"
                          onClick={() => {
                            handleViewItemClick({
                              contractAddress: data.assetContract,
                              tokenId: data.tokenId,
                            });
                          }}
                          actionCTA="Cancel Auction"
                          actionOnClick={() => {
                            handleCancelAuction({
                              auctionId: data.auctionId,
                            });
                          }}
                          isDisabled={isDisabled}
                        />
                      );
                    })}
                    {filteredData?.length > displayCount && (
                      <div
                        ref={loadMoreRef}
                        className="w-full h-20 col-span-full"
                        style={{ gridColumn: "1 / -1" }}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    message={
                      searchQuery.length > 0
                        ? "No NFTs found"
                        : "No NFT Auctioned"
                    }
                  />
                )}
              </div>
            )}

            {/* Offers NFTS */}
            {selectedFilter === filters[3] && (
              <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                {isUserOffersLoading || isUserOffersPending ? (
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                    {Array.from({ length: 4 }, (_, index) => (
                      <NftCardSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredData &&
                  paginatedData &&
                  paginatedData.length > 0 ? (
                  <>
                    {paginatedData?.map((offer, index) => {
                      console.log({ offer });
                      const data = offer as Offer;
                      return (
                        <NFTCard
                          key={index}
                          data={data}
                          type="offers"
                          cta="View Item"
                          onClick={() => {
                            handleViewItemClick({
                              contractAddress: data.assetContract,
                              tokenId: data.tokenId,
                            });
                          }}
                          actionCTA="Cancel Offer"
                          actionOnClick={() => {
                            handleCancelOffer({
                              offerId: data.offerId,
                            });
                          }}
                          isDisabled={isDisabled}
                        />
                      );
                    })}
                    {filteredData?.length > displayCount && (
                      <div
                        ref={loadMoreRef}
                        className="w-full h-20 col-span-full"
                        style={{ gridColumn: "1 / -1" }}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    message={
                      searchQuery.length > 0 ? "No NFTs found" : "No NFT Offers"
                    }
                  />
                )}
              </div>
            )}

            {/* Offers Received NFTS */}
            {selectedFilter === filters[4] && (
              <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                {isUserOffersReceivedLoading || isUserOffersReceivedPending ? (
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                    {Array.from({ length: 4 }, (_, index) => (
                      <NftCardSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredData &&
                  paginatedData &&
                  paginatedData.length > 0 ? (
                  <>
                    {paginatedData?.map((offer, index) => {
                      console.log({ offer });
                      const data = offer as Offer;
                      return (
                        <NFTCard
                          key={index}
                          data={data}
                          type="user-offers-received"
                          cta="View Item"
                          onClick={() => {
                            handleViewItemClick({
                              contractAddress: data.assetContract,
                              tokenId: data.tokenId,
                            });
                          }}
                          extraTitle="Total Offers"
                          extraInfo={
                            userOffersReceived?.userOffersReceivedLength
                          }
                        />
                      );
                    })}
                    {filteredData?.length > displayCount && (
                      <div
                        ref={loadMoreRef}
                        className="w-full h-20 col-span-full"
                        style={{ gridColumn: "1 / -1" }}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    message={
                      searchQuery.length > 0
                        ? "No NFTs found"
                        : "No NFT Offers Received"
                    }
                  />
                )}
              </div>
            )}

            {/* Bids NFTS */}
            {selectedFilter === filters[5] && (
              <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                {isUserBidsLoading || isUserBidsPending ? (
                  <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                    {Array.from({ length: 4 }, (_, index) => (
                      <NftCardSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredData &&
                  paginatedData &&
                  paginatedData.length > 0 ? (
                  <>
                    {paginatedData?.map((bid, index) => {
                      const data = bid as NewBid;
                      return (
                        <NFTCard
                          key={index}
                          data={data}
                          type="user-bids"
                          cta="View Item"
                          onClick={() => {
                            handleViewItemClick({
                              contractAddress: data.assetContract,
                              tokenId: data.tokenId,
                            });
                          }}
                        />
                      );
                    })}
                    {filteredData?.length > displayCount && (
                      <div
                        ref={loadMoreRef}
                        className="w-full h-20 col-span-full"
                        style={{ gridColumn: "1 / -1" }}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    message={
                      searchQuery.length > 0 ? "No NFTs found" : "No Bids"
                    }
                  />
                )}
              </div>
            )}

            {/* User NFT Activities */}
            {selectedFilter === filters[6] && (
              <div className="flex items-center gap-8 flex-wrap w-full">
                {userNFTActivities &&
                paginatedNFTActivitiesData &&
                paginatedNFTActivitiesData.length > 0 ? (
                  <div className="mt-6 w-full">
                    {paginatedNFTActivitiesData &&
                      Object.entries(
                        paginatedNFTActivitiesData.reduce((acc, transfer) => {
                          const date = new Date(
                            transfer.timestamp
                          ).toLocaleDateString();
                          return {
                            ...acc,
                            [date]: [...(acc[date] || []), transfer],
                          };
                        }, {} as Record<string, typeof paginatedNFTActivitiesData>)
                      ).map(([date, transfers]) => {
                        return (
                          <div key={date} className="mb-8">
                            <div className="bg-card w-full py-2 px-3 rounded-lg mb-4">
                              <p className="text-sm font-medium">{date}</p>
                            </div>

                            <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center gap-5">
                              {/* <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center gap-5"> */}
                              {transfers.map((transfer, index) => {
                                const image = transfer.nft?.metadata.image;
                                const name = transfer.nft?.metadata.name;

                                return (
                                  <div
                                    key={index}
                                    className="bg-card rounded-2xl p-4 flex items-center gap-4"
                                  >
                                    <div className="flex-shrink-0">
                                      <ImageHolder
                                        src={image!}
                                        alt={name!}
                                        className="rounded-lg object-cover size-20"
                                        width="80px"
                                        height="80px"
                                      />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                      <p className="font-medium text-lg mb-2">
                                        Received NFT
                                      </p>
                                      <span className="flex items-center gap-1 w-full justify-between">
                                        <p className="text-sm text-muted-foreground truncate">
                                          From{" "}
                                          <span className="text-foreground font-medium">
                                            {getFormatAddress(
                                              transfer.addressFrom
                                            )}
                                          </span>
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                          To{" "}
                                          <span className="text-foreground font-medium">
                                            {getFormatAddress(
                                              transfer.addressTo
                                            )}
                                          </span>
                                        </p>
                                      </span>

                                      <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(
                                            transfer.timestamp
                                          ).toLocaleTimeString()}
                                        </p>
                                        <Link
                                          href={`${chainInfo.blockExplorers?.[0]?.url}/tx/${transfer.txHash}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex-shrink-0 "
                                        >
                                          <LinkIcon className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-300 ease-in-out" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    {userNFTActivities.length > displayCount && (
                      <div
                        ref={loadMoreRef}
                        className="w-full h-20 col-span-full"
                        style={{ gridColumn: "1 / -1" }}
                      />
                    )}
                  </div>
                ) : (
                  <EmptyState
                    message={
                      searchQuery.length > 0
                        ? "No NFTs found"
                        : "No NFT Activities"
                    }
                  />
                )}
              </div>
            )}

            {/* Expired Data */}
            {selectedFilter === filters[7] && (
              <>
                {/** Expired Listings */}
                {selectedOption === options[0] && (
                  <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                    {isUserExpiredListingsLoading ||
                    isUserExpiredListingsPending ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                        {Array.from({ length: 4 }, (_, index) => (
                          <NftCardSkeleton key={index} />
                        ))}
                      </div>
                    ) : expiredListings &&
                      paginatedExpiredListingsData &&
                      paginatedExpiredListingsData.length > 0 ? (
                      <>
                        {paginatedExpiredListingsData?.map((listing, index) => {
                          const data = listing as Listing;
                          return (
                            <NFTCard
                              key={index}
                              data={data}
                              type="user-listing"
                              cta="View Item"
                              onClick={() => {
                                handleViewItemClick({
                                  contractAddress: data.assetContract,
                                  tokenId: data.tokenId,
                                });
                              }}
                              actionCTA="Cancel Listing"
                              actionOnClick={() => {
                                handleCancelListing({
                                  listingId: data.listingId,
                                });
                              }}
                              isDisabled={isDisabled}
                            />
                          );
                        })}
                        {expiredListings?.length > displayCount && (
                          <div
                            ref={loadMoreRef}
                            className="w-full h-20 col-span-full"
                            style={{ gridColumn: "1 / -1" }}
                          />
                        )}
                      </>
                    ) : (
                      <EmptyState
                        message={
                          searchQuery.length > 0
                            ? "No NFTs found"
                            : "No Expired Listings"
                        }
                      />
                    )}
                  </div>
                )}

                {/** Expired Auctions */}
                {selectedOption === options[1] && (
                  <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                    {isUserExpiredAuctionsLoading ||
                    isUserExpiredAuctionsPending ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                        {Array.from({ length: 4 }, (_, index) => (
                          <NftCardSkeleton key={index} />
                        ))}
                      </div>
                    ) : expiredAuctions &&
                      paginatedExpiredAuctionsData &&
                      paginatedExpiredAuctionsData.length > 0 ? (
                      <>
                        {paginatedExpiredAuctionsData?.map((auction, index) => {
                          const data = auction as Auction;
                          return (
                            <NFTCard
                              key={index}
                              data={data}
                              type="user-auction"
                              cta="View Item"
                              onClick={() => {
                                handleViewItemClick({
                                  contractAddress: data.assetContract,
                                  tokenId: data.tokenId,
                                });
                              }}
                              actionCTA="Cancel Auction"
                              actionOnClick={() => {
                                handleCancelAuction({
                                  auctionId: data.auctionId,
                                });
                              }}
                              isDisabled={isDisabled}
                            />
                          );
                        })}
                        {expiredAuctions?.length > displayCount && (
                          <div
                            ref={loadMoreRef}
                            className="w-full h-20 col-span-full"
                            style={{ gridColumn: "1 / -1" }}
                          />
                        )}
                      </>
                    ) : (
                      <EmptyState
                        message={
                          searchQuery.length > 0
                            ? "No NFTs found"
                            : "No Expired Auctions"
                        }
                      />
                    )}
                  </div>
                )}

                {/** Expired Offers */}
                {selectedOption === options[2] && (
                  <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                    {isUserExpiredOffersLoading ||
                    isUserExpiredOffersPending ? (
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 max-sm w-full">
                        {Array.from({ length: 4 }, (_, index) => (
                          <NftCardSkeleton key={index} />
                        ))}
                      </div>
                    ) : expiredOffers &&
                      paginatedExpiredOffersData &&
                      paginatedExpiredOffersData.length > 0 ? (
                      <>
                        {paginatedExpiredOffersData?.map((offer, index) => {
                          const data = offer as Offer;
                          return (
                            <NFTCard
                              key={index}
                              data={data}
                              type="user-offers"
                              cta="View Item"
                              onClick={() => {
                                handleViewItemClick({
                                  contractAddress: data.assetContract,
                                  tokenId: data.tokenId,
                                });
                              }}
                              actionCTA="Cancel Offer"
                              actionOnClick={() => {
                                handleCancelOffer({
                                  offerId: data.offerId,
                                });
                              }}
                              isDisabled={isDisabled}
                            />
                          );
                        })}
                        {expiredOffers?.length > displayCount && (
                          <div
                            ref={loadMoreRef}
                            className="w-full h-20 col-span-full"
                            style={{ gridColumn: "1 / -1" }}
                          />
                        )}
                      </>
                    ) : (
                      <EmptyState
                        message={
                          searchQuery.length > 0
                            ? "No NFTs found"
                            : "No Expired Offers"
                        }
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {/* User Collections */}
            {selectedFilter === filters[8] && (
              <div className="w-full grid min-[1250px]:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 grid-cols-1 place-content-center justify-items-center gap-5">
                {userCollections &&
                paginatedCollectionsData &&
                paginatedCollectionsData.length > 0 ? (
                  <>
                    {paginatedCollectionsData?.map((collection, index) => {
                      const data = collection as Collection;

                      return (
                        <CollectionsNFTCard
                          key={index}
                          {...data}
                          onClick={() => {
                            router.push(
                              `/collections/${data.collectionAddress}`
                            );
                          }}
                          cta="View Collection"
                        />
                      );
                    })}
                    {userCollections?.length > displayCount && (
                      <div
                        ref={loadMoreRef}
                        className="w-full h-20 col-span-full"
                        style={{ gridColumn: "1 / -1" }}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState
                    message={
                      searchQuery.length > 0
                        ? "No NFTs found"
                        : "No NFT Offers Received"
                    }
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4">
            <p>Please connect wallet to continue</p>
            <ConnectButton
              client={client}
              chain={chainInfo}
              wallets={[createWallet("io.metamask")]}
              connectButton={{
                label: "Connect Wallet",
                className:
                  "!font-space !rounded-lg !p-2 max-sm:!w-full !w-fit !text-sm !min-w-0 !flex !items-center !max-w-[28] !justify-center hover:!bg-primary/85 !duration-300 !ease-in-out !transition !bg-primary !text-white !h-[34px]",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CustomNFTCard({ data }: { data: UserNFTData }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { metadata, tokenId, owner } = data?.nft || {};
  const { name, image } = metadata || {};
  const cta = "View Item";

  const handleViewItemClick = ({
    contractAddress,
    tokenId,
  }: {
    contractAddress: string;
    tokenId: string;
  }) => {
    router.push(`/nft/${contractAddress}/${tokenId}`);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-card w-[293px] border group cursor-pointer border-border rounded-2xl  flex flex-col gap-6 p-4 backdrop-blur-2xl"
    >
      <p className="font-medium text-white">
        {name} - {tokenId}
      </p>

      <div className="w-[261px] h-[220px] relative overflow-hidden">
        <ImageHolder
          src={image}
          alt={name}
          className="group-hover:scale-[1.01]"
        />
        {isHovered && (
          <div
            className="bg-black/70 absolute inset-0 group-hover:scale-[1.01] backdrop-blur-sm"
            style={{
              clipPath:
                "path('M240.781 1H168.03C165.188 1 162.48 2.20945 160.583 4.32607L158.91 6.19251C157.013 8.30913 154.305 9.51859 151.463 9.51859H125.602C122.421 9.51859 119.43 8.00545 117.546 5.44303L117.275 5.07556C115.391 2.51314 112.4 1 109.219 1H11C5.47716 1 1 5.47715 1 11V66.5511C1 69.0143 1.90906 71.3907 3.55294 73.225L7.47338 77.5996C9.11726 79.434 10.0263 81.8104 10.0263 84.2736V138.909C10.0263 141.372 9.11726 143.749 7.47339 145.583L5.2145 148.103C3.57062 149.938 2.66156 152.314 2.66156 154.777V210.329C2.66156 215.851 7.13872 220.329 12.6616 220.329H104.243C107.086 220.329 109.794 219.119 111.69 217.002L114.171 214.234C116.068 212.117 118.776 210.908 121.618 210.908H150.916C153.763 210.908 156.475 212.121 158.372 214.244L160.672 216.817C162.569 218.94 165.281 220.153 168.128 220.153H247.217C252.74 220.153 257.217 215.676 257.217 210.153V153.373C257.217 151.073 258.069 148.854 259.609 147.144V147.144C261.148 145.434 262 143.215 262 140.914V81.807C262 79.8581 261.431 77.9516 260.362 76.322L258.856 74.0266C257.787 72.397 257.217 70.4906 257.217 68.5417V11C257.217 5.47716 252.74 1 247.217 1H240.781Z')",
            }}
          />
        )}
      </div>
      <div className="flex items-center w-full justify-between">
        <div>
          <div className="flex items-center gap-1">
            <p className="text-lg font-medium text-white">Owner</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {getFormatAddress(owner)}
          </p>
        </div>
        {/* <div>
          <p className="text-lg font-medium text-white">{"info2"}</p>
          <p className="text-sm text-muted-foreground">{"title2"}</p>
        </div> */}
      </div>
      {cta && (
        <motion.div className="w-full flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.button
            onClick={() =>
              handleViewItemClick({
                contractAddress: data.contractAddress,
                tokenId: data.tokenId,
              })
            }
            initial={{ y: "-100%", opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 40,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="bg-primary text-white w-fit rounded-lg py-2 px-3 text-sm font-medium"
          >
            {cta}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
