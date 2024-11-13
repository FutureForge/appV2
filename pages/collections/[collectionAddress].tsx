import { useSingleCollectionQuery } from "@/modules/query";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  IconButton,
  Select,
  TextField,
  ToggleGroup,
} from "@/modules/app";
import { getFormatAddress } from "@/utils/functions";
// icons
import VerifyIcon from "@/assets/verified.svg";
import X from "@/assets/logo-x-twitter.svg";
import Telegram from "@/assets/telegram.svg";
import Discord from "@/assets/discord.svg";
import FilterIcon from "@/assets/filter-lines.svg";
import LinkIcon from "@/assets/link-external-02.svg";

const collectionSocials = [
  { icon: <X className="size-[14px]" />, link: "" },
  { icon: <Discord className="size-[14px]" />, link: "" },
  { icon: <Telegram className="size-[14px]" />, link: "" },
];

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
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short", 
    day: "2-digit", 
    year: "numeric", 
  });
};
export default function CollectionPage() {
  const router = useRouter();
  const { collectionAddress } = router.query;
  const [filter, setFilter] = useState<FilterType>("Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Listed");
  const {
    data: singleCollection,
    isLoading,
    isError,
  } = useSingleCollectionQuery({
    contractAddress: collectionAddress as string,
  });
  const collection = singleCollection?.collection;
  const collectionDetails = singleCollection?.collectionDetails;
  console.log(singleCollection?.tokenTransfers, "Activity");
  const collectionLabels = {
    floorPrice: "Floor Price",
    holderCount: "Holders",
    listedNFTs: "Listed",
    percentageOfAuctioned: "Unique Holers",
    percentageOfListed: "Total Listed",
    totalVolume: "Volume",
  };

  // Define the order of the properties
  const displayOrder = [
    "floorPrice",
    "totalVolume",
    "holderCount",
    "listedNFTs",
    "percentageOfAuctioned",
    "percentageOfListed",
  ];

  const renderCollectionDetails = () => {
    if (!collectionDetails) return <p>No collection details available</p>;

    return displayOrder.map((key) => {
      const value = collectionDetails[key as keyof typeof collectionDetails];
      const label = collectionLabels[key as keyof typeof collectionLabels];

      const displayValue = value === undefined ? 0 : value;

      return (
        <div key={key}>
          <h4 className="text-lg font-medium">{displayValue}</h4>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      );
    });
  };

  return (
    <div className="mt-20 w-full min-h-screen px-6">
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
                  {collection?.collectionName} <VerifyIcon />
                </h4>
                <div className="flex items-center gap-2">
                  {collectionSocials.map((item, index) => {
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
              onValueChange={(value) => setFilter(value as FilterType)}
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
            <TextField
              type="search"
              placeholder="Search by collections"
              containerClass="bg-new-muted-bg w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
                {["Listed", "Token Id", "Auction", "Listing"].map((item) => (
                  <Select.Item key={item} value={item}>
                    {item}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

      {/* Render Activity Content */}
      {filter === "Activity" && singleCollection?.tokenTransfers && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Activity</h3>
          <div>
            {singleCollection.tokenTransfers.length === 0 ? (
              <p>No activity found</p>
            ) : (
              singleCollection.tokenTransfers.map((transfer, index) => (
                <div key={index} className="mb-6">
                  <div className="bg-card w-full py-2 px-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {formatTimestamp(transfer.timestamp)}
                    </p>
                  </div>
                  <div className="mt-4 bg-card rounded-2xl p-4 w-[242px] flex items-center gap-2.5">
                    <div>
                      <Image
                        src={"/nft.png"}
                        alt="nft image"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div>
                      <p className="font-medium">Received NFT</p>
                      <span className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          From: {getFormatAddress(transfer.addressFrom)}
                        </p>
                        <Link href="/">
                          <LinkIcon className="size-[14px] text-muted-foreground" />
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function CollectionSettings(){
  return(
    <div>
      
    </div>
  )
}