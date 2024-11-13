import { useSingleCollectionQuery } from "@/modules/query";
import Image from "next/image";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  Card,
  IconButton,
  NFTCard,
  Select,
  TextField,
  ToggleGroup,
} from "@/modules/app";
import { getFormatAddress } from "@/utils/functions";
import {
  Collection,
  CollectionNFTType,
  SingleCollection,
} from "@/utils/types/collection/collection.type";
import XFI from "@/assets/xfi.svg";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { motion } from "framer-motion";
import { Auction, Listing, Offer } from "@/utils/types/graphql";
import {
  NFTCardInfo,
  NFTStatus,
} from "@/modules/app/component/nft-card/utils/nft-card.utils";
import { chainInfo } from "@/utils/configs";

// icons
import VerifyIcon from "@/assets/verified.svg";
import X from "@/assets/logo-x-twitter.svg";
import Telegram from "@/assets/telegram.svg";
import Discord from "@/assets/discord.svg";
import FilterIcon from "@/assets/filter-lines.svg";
import LinkIcon from "@/assets/link-external-02.svg";
import Head from "next/head";
import { useRouter } from "next/router";

// TODO: * Pagination

type FilterType =
  | "Items"
  | "Offers"
  | "Sales"
  | "Activity"
  | "Collection Settings";

const filters: FilterType[] = [
  "Items",
  "Offers",
  "Sales",
  "Activity",
  "Collection Settings",
];

// const formatTimestamp = (timestamp: string): string => {
//   const date = new Date(timestamp);
//   return date.toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "2-digit",
//     year: "numeric",
//   });
// };

const defaultCollectionSocials = [
  { icon: <X className="size-[14px]" />, link: "" },
  { icon: <Discord className="size-[14px]" />, link: "" },
  { icon: <Telegram className="size-[14px]" />, link: "" },
];

const ITEMS_PER_PAGE = 4;

export default function CollectionPage() {
  const router = useRouter();
  const { collectionAddress } = router.query;
  const [filter, setFilter] = useState<FilterType>("Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
    }
  }, [inView]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filter, searchQuery, selectedFilter]);

  const {
    data: singleCollection,
    isLoading,
    isError,
  } = useSingleCollectionQuery({
    contractAddress: collectionAddress as string,
  });

  const collection = singleCollection?.collection;
  const collectionSocials = singleCollection?.collection?.collectionSocials;
  const collectionDetails = singleCollection?.collectionDetails;
  const collectionTokenTransfers = singleCollection?.tokenTransfers;
  const collectionNFTs = singleCollection?.collectionNFTs;
  const collectionAllAuctions =
    singleCollection?.collectionAuctions?.allAuctions;
  const collectionAllListings =
    singleCollection?.collectionListings?.allListings;
  const collectionAllOffers = singleCollection?.collectionOffers?.allOffers;
  const collectionListingSales =
    singleCollection?.collectionListings?.completedListings;
  const collectionAuctionSales =
    singleCollection?.collectionAuctions?.auctionClosed;

  const updatedCollectionSocials = collectionSocials?.map((item) => ({
    icon:
      item.socialName === "twitter" ? (
        <X className="size-[14px]" />
      ) : item.socialName === "discord" ? (
        <Discord className="size-[14px]" />
      ) : (
        <Telegram className="size-[14px]" />
      ),
    link: item.socialLink,
  }));

  const collectionSales = [
    ...(collectionListingSales?.map((sale) => ({
      ...sale,
      saleType: "completed-listing",
      nftStatus: "listed",
    })) || []),
    ...(collectionAuctionSales?.map((sale) => ({
      ...sale,
      saleType: "new-sold-auction",
      nftStatus: "auctioned",
    })) || []),
  ].flat();

  const collectionLabels = {
    floorPrice: "Floor Price",
    holderCount: "Holders",
    listedNFTs: "Listed",
    percentageOfAuctioned: "Auction %",
    percentageOfListed: "Listed %",
    totalVolume: "Total Volume",
  };

  const displayOrder = [
    "floorPrice",
    "totalVolume",
    "holderCount",
    "listedNFTs",
    "percentageOfAuctioned",
    "percentageOfListed",
  ];

  const filteredCollectionNFTs: CollectionNFTType[] =
    collectionNFTs?.filter((nft) => {
      // First apply search filter
      const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
      const nameNoSpace = nft.metadata.name.toLowerCase().replace(/\s+/g, "");
      const tokenIdNoSpace = nft.tokenId.toLowerCase().replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;
      const matchesSearch = combinedField.includes(searchTerm);

      // Then apply type filter
      const isListed = collectionAllListings?.some(
        (listing) => listing.tokenId === nft.tokenId
      );
      const isAuctioned = collectionAllAuctions?.some(
        (auction) => auction.tokenId === nft.tokenId
      );

      switch (selectedFilter) {
        case "All":
          return matchesSearch;
        // case "Token Id":
        //   return matchesSearch && tokenIdNoSpace.includes(searchTerm);
        case "Auction":
          return matchesSearch && isAuctioned;
        case "Listing":
          return matchesSearch && isListed;
        default:
          return matchesSearch;
      }
    }) ?? [];

  const filteredCollectionOffers: Offer[] =
    collectionAllOffers?.filter((offer) => {
      const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
      const nameNoSpace = offer.nft.metadata.name
        .toLowerCase()
        .replace(/\s+/g, "");
      const tokenIdNoSpace = offer.nft.tokenId
        .toLowerCase()
        .replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

      return combinedField.includes(searchTerm);
    }) ?? [];

  const filteredCollectionSales =
    collectionSales?.filter((sale) => {
      const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
      const nameNoSpace = sale.nft.metadata.name
        .toLowerCase()
        .replace(/\s+/g, "");
      const tokenIdNoSpace = sale.nft.tokenId.toLowerCase().replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}${tokenIdNoSpace}`;

      return combinedField.includes(searchTerm);
    }) ?? [];

  const filteredCollectionTokenTransfers =
    collectionTokenTransfers?.filter((transfer) => {
      const searchTerm = searchQuery.toLowerCase().trim().replace(/\s+/g, "");
      const nameNoSpace =
        transfer?.nft?.metadata?.name?.toLowerCase().replace(/\s+/g, "") || "";
      const tokenIdNoSpace = transfer?.tokenId
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "");
      const addressFromNoSpace = transfer?.addressFrom
        ?.toLowerCase()
        .replace(/\s+/g, "");
      const addressToNoSpace = transfer?.addressTo
        ?.toLowerCase()
        .replace(/\s+/g, "");
      const combinedField = `${nameNoSpace}${tokenIdNoSpace}${addressFromNoSpace}${addressToNoSpace}`;

      return combinedField.includes(searchTerm);
    }) ?? [];

  const paginatedCollectionNFTs = filteredCollectionNFTs?.slice(
    0,
    displayCount
  );
  const paginatedCollectionOffers = filteredCollectionOffers?.slice(
    0,
    displayCount
  );
  const paginatedCollectionSales = filteredCollectionSales?.slice(
    0,
    displayCount
  );
  const paginatedCollectionTokenTransfers =
    filteredCollectionTokenTransfers?.slice(0, displayCount);

  const renderCollectionDetails = () => {
    if (!collectionDetails) return <p>No collection details available</p>;

    return displayOrder.map((key) => {
      const value = collectionDetails[key as keyof typeof collectionDetails];
      const label = collectionLabels[key as keyof typeof collectionLabels];
      const symbol = "XFI";

      const displayValue = value === undefined ? 0 : value;
      const shouldShowSymbol = key === "floorPrice" || key === "totalVolume";

      return (
        <div key={key}>
          {shouldShowSymbol ? (
            <div className="flex items-center gap-2">
              <XFI />
              {displayValue || 0} {symbol}
            </div>
          ) : (
            displayValue || 0
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      );
    });
  };

  return (
    <div className="mt-20 w-full min-h-screen px-6">
      <Head>
        <title>
          Mint Mingle Marketplace - {collection?.collectionName || "Collection"}
        </title>
        <meta
          name="description"
          content={`Collection: ${
            collection?.collectionName || "Collection"
          } on Mint Mingle Marketplace`}
        />
      </Head>
      <div className="h-[395px] relative w-full px-[35px] py-10 flex items-end">
        <Image
          src={collection?.collectionBackgroundImage || ""}
          alt={collection?.collectionName || ""}
          layout="fill"
          quality={100}
          priority
          className="w-full h-full object-cover rounded-3xl"
        />
        <div className="bg-gradient-to-tr from-background via-background/95 to-transparent absolute inset-0 z-10" />
        <div className="z-40 flex items-end justify-between w-full">
          <div className="z-30 flex flex-col gap-6 w-[40%]">
            <div className="flex flex-col gap-4 z-40">
              <Image
                src={collection?.collectionImage || ""}
                alt={collection?.collectionName || ""}
                width={123}
                height={123}
                className="size-[123px] rounded-[22px] z-40"
              />
              <div className="z-40 flex flex-col gap-3">
                <h4 className="text-2xl font-medium flex gap-2 items-center">
                  {collection?.collectionName || "Collection Name"}{" "}
                  <VerifyIcon />
                </h4>
                <div className="flex items-center gap-2">
                  {updatedCollectionSocials
                    ? updatedCollectionSocials.map((item, index) => {
                        const { icon, link } = item;
                        return (
                          <Link
                            key={`collection-social-${index}`}
                            href={link}
                            className="bg-tertiary rounded-lg size-7 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-table-hover"
                          >
                            {icon}
                          </Link>
                        );
                      })
                    : defaultCollectionSocials.map((item, index) => {
                        const { icon, link } = item;
                        return (
                          <Link
                            key={`collection-social-${index}`}
                            href={link}
                            className="bg-tertiary rounded-lg size-7 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-table-hover"
                          >
                            {icon}
                          </Link>
                        );
                      })}
                </div>
              </div>
            </div>
            <div className="z-40">
              <p>
                {collection?.collectionDescription ||
                  "Lorem ipsum dolor sit amet consectetur. Orci proin elementum faucibus tincidunt id."}
              </p>
            </div>
          </div>
          <div className="z-40 flex items-center justify-between flex-1">
            {renderCollectionDetails()}
          </div>
        </div>
      </div>

      {/* filter */}
      <div className="mt-7">
        <div className="w-full flex justify-between items-center">
          <Card className="bg-transparent border border-new-muted-text p-1 rounded-xl h-10">
            <ToggleGroup.Root
              type="single"
              value={filter}
              onValueChange={(value) => {
                if (value) setFilter(value as FilterType);
              }}
            >
              {filters.map((value) => (
                <ToggleGroup.Item
                  variant="select"
                  value={value}
                  className="data-[state=on]:bg-tertiary data-[state=on]:text-primary"
                >
                  {value}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </Card>

          <div className="flex items-center gap-2">
            {filter !== "Collection Settings" && (
              <TextField
                type="search"
                placeholder="Search by collections"
                containerClass="bg-new-muted-bg w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
            {(filter === "Sales" || filter === "Items") && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground bg-tertiary px-3 py-1 rounded-lg font-medium">
                  {selectedFilter}
                </span>
                <Select.Root
                  value={selectedFilter}
                  onValueChange={setSelectedFilter}
                >
                  <Select.Trigger>
                    <IconButton size="xl" variant="ghost">
                      <FilterIcon className="size-4 text-muted-foreground" />
                    </IconButton>
                  </Select.Trigger>
                  <Select.Content align="end" className="w-[103px]">
                    {["All", "Auction", "Listing"].map((item) => (
                      <Select.Item key={item} value={item}>
                        {item}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Items Content */}
      {filter === "Items" && (
        <div className="mt-6">
          <div className="flex items-center gap-8 flex-wrap">
            {paginatedCollectionNFTs && paginatedCollectionNFTs.length > 0 ? (
              <>
                {paginatedCollectionNFTs.map((nft, index) => {
                  const isListed: Listing | undefined =
                    collectionAllListings?.find(
                      (listing) => listing.tokenId === nft.tokenId
                    );
                  const isAuctioned: Auction | undefined =
                    collectionAllAuctions?.find(
                      (auction) => auction.tokenId === nft.tokenId
                    );

                  const status = isListed
                    ? "listed"
                    : isAuctioned
                    ? "auctioned"
                    : "";

                  const type = isListed ? "listing" : "auction";
                  const data = isListed ? isListed : isAuctioned;

                  const extraOnClick = isListed
                    ? () => {
                        console.log("Listing Buy Now Clicked");
                      }
                    : () => {
                        console.log("Auction Buy Now Clicked");
                      };

                  const ctaOnClick = () => {
                    console.log("View Clicked");
                  };

                  return status !== "" && data ? (
                    <NFTCard
                      key={index}
                      data={data}
                      status={status}
                      type={type}
                      cta="View Item"
                      extraCTA={isListed ? "Buy Listing" : "Buy Auction"}
                      ctaStyles="!bg-border"
                      extraOnClick={extraOnClick}
                      onClick={ctaOnClick}
                    />
                  ) : (
                    <CollectionNFTCard
                      key={index}
                      nft={nft}
                      collectionAddress={collectionAddress as string}
                    />
                  );
                })}
                {filteredCollectionOffers.length > displayCount && (
                  <div ref={loadMoreRef} className="h-10" />
                )}
              </>
            ) : (
              <div className="w-full items-center justify-center flex h-52">
                {searchQuery.length > 0
                  ? "No items found"
                  : "No items in this collection"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Render Offers Content */}
      {filter === "Offers" && (
        <div className="mt-6">
          <div className="flex items-center gap-8 flex-wrap">
            {paginatedCollectionOffers &&
            paginatedCollectionOffers.length > 0 ? (
              <>
                {paginatedCollectionOffers.map((offer, index) => (
                  <NFTCard key={index} data={offer} type="offers" />
                ))}
                {filteredCollectionOffers.length > displayCount && (
                  <div ref={loadMoreRef} className="h-10" />
                )}
              </>
            ) : (
              <div className="w-full items-center justify-center flex h-52">
                {searchQuery.length > 0
                  ? "No offers found"
                  : "No offers in this collection"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Render Sales Content */}
      {filter === "Sales" && (
        <div className="mt-6">
          <div className="flex items-center gap-8 flex-wrap">
            {paginatedCollectionSales && paginatedCollectionSales.length > 0 ? (
              <>
                {paginatedCollectionSales.map((sale, index) => {
                  return (
                    <NFTCard
                      key={index}
                      data={sale}
                      type={sale.saleType as NFTCardInfo}
                      status={sale.nftStatus as NFTStatus}
                    />
                  );
                })}
                {filteredCollectionSales.length > displayCount && (
                  <div ref={loadMoreRef} className="h-10" />
                )}
              </>
            ) : (
              <div className="w-full items-center justify-center flex h-52">
                {searchQuery.length > 0
                  ? "No sales found"
                  : "No sales in this collection"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Render Activity Content */}
      {filter === "Activity" &&
        (filteredCollectionTokenTransfers &&
        filteredCollectionTokenTransfers.length > 0 ? (
          <div className="mt-6">
            <div>
              {paginatedCollectionTokenTransfers &&
                Object.entries(
                  paginatedCollectionTokenTransfers.reduce((acc, transfer) => {
                    const date = new Date(
                      transfer.timestamp
                    ).toLocaleDateString();
                    return {
                      ...acc,
                      [date]: [...(acc[date] || []), transfer],
                    };
                  }, {} as Record<string, typeof paginatedCollectionTokenTransfers>)
                ).map(([date, transfers]) => {
                  return (
                    <div key={date} className="mb-8">
                      <div className="bg-card w-full py-2 px-3 rounded-lg mb-4">
                        <p className="text-sm font-medium">{date}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <span className="flex items-center w-full justify-between">
                                  <p className="text-sm text-muted-foreground truncate">
                                    From{" "}
                                    <span className="text-foreground font-medium">
                                      {getFormatAddress(transfer.addressFrom)}
                                    </span>
                                  </p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    To{" "}
                                    <span className="text-foreground font-medium">
                                      {getFormatAddress(transfer.addressTo)}
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
              {filteredCollectionTokenTransfers.length > displayCount && (
                <div ref={loadMoreRef} className="h-10" />
              )}
            </div>
          </div>
        ) : (
          <div className="w-full items-center justify-center flex h-52">
            {searchQuery.length > 0
              ? "No items found"
              : "No activity in this collection"}
          </div>
        ))}

      {/* Render Collection Settings Content */}
      {filter === "Collection Settings" && singleCollection?.collection && (
        <CollectionSettings collection={singleCollection.collection} />
      )}
    </div>
  );
}

type CollectionSettingsProps = {
  collection: Collection;
};

function CollectionSettings({ collection }: CollectionSettingsProps) {
  const [newCollectionImage, setNewCollectionImage] = useState<string | null>(
    null
  );
  const [newCollectionBackgroundImage, setNewCollectionBackgroundImage] =
    useState<string | null>(null);

  // Refs for file inputs
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  // Max file size and valid types
  const MAX_FILE_SIZE_MB = 5; // Maximum file size (in MB)
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const VALID_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/avif",
  ];

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "background"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!VALID_FILE_TYPES.includes(file.type)) {
        alert(
          "Invalid file type. Please upload a JPG, PNG, GIF, WEBP, or AVIF file."
        );
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      // If the file passes validation, read and preview it
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "image") {
          setNewCollectionImage(reader.result as string);
        } else {
          setNewCollectionBackgroundImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center w-full gap-8 mt-8">
      <div className="flex items-center gap-4">
        {/* Collection Image */}
        <div className="relative w-[392px] h-[447px]">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src={newCollectionImage || collection.collectionImage}
            alt="Collection Image"
            layout="fill"
            className="object-cover rounded-lg cursor-pointer"
            onClick={() => imageFileInputRef.current?.click()}
          />
          <input
            placeholder="Collection Image"
            type="file"
            accept="image/*"
            ref={imageFileInputRef}
            onChange={(e) => handleImageChange(e, "image")}
            style={{ display: "none" }}
          />
          <button
            onClick={() => imageFileInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 transform z-20 text-sm -translate-x-1/2 -translate-y-1/2 p-2 bg-card border border-border text-white rounded-lg"
          >
            Change Image
          </button>
        </div>

        {/* Collection Background Image */}
        <div className="relative w-[392px] h-[447px]">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src={
              newCollectionBackgroundImage ||
              collection.collectionBackgroundImage
            }
            layout="fill"
            alt="Collection Background"
            className="object-cover rounded-lg cursor-pointer"
            onClick={() => backgroundFileInputRef.current?.click()}
          />
          <input
            placeholder="Collection Background Image"
            type="file"
            accept="image/*"
            ref={backgroundFileInputRef}
            onChange={(e) => handleImageChange(e, "background")}
            style={{ display: "none" }} // Hide the file input
          />
          <button
            onClick={() => backgroundFileInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 text-sm transform z-20 -translate-x-1/2 -translate-y-1/2 p-2 bg-card border border-border text-white rounded-lg"
          >
            Change Background
          </button>
        </div>
      </div>
    </div>
  );
}

function CollectionNFTCard({
  nft,
  collectionAddress,
}: {
  nft: CollectionNFTType;
  collectionAddress: string;
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { metadata, tokenId, owner } = nft || {};
  const { name, image } = metadata || {};
  const cta = "View Item";

  const handleClick = () => {
    router.push(`/nfts/${collectionAddress}/${tokenId}`);
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
            onClick={handleClick}
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
