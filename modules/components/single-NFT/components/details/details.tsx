import { Button, Header } from "@/modules/app";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { useFilterStore } from "../../store";
import { useSingleNFTQuery, useUserChainInfo } from "@/modules/query";
import { Fee } from "@/modules/app/component/nft-card/utils/nft-card.utils";
import { decimalOffChain } from "@/modules/blockchain";

// icons
import Line from "@/assets/line.svg";
import XFI from "@/assets/xfi.svg";

export const singleNFTFilters = ["Not Listed", "Listed", "Auction", "Expired"];

type DetailsProps = {
  contractAddress: string;
  tokenId: string;
};

const FeeRow = ({
  label,
  value,
  isAddress = false,
}: {
  label: string;
  value: string;
  isAddress?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <p className="text-muted-foreground capitalize text-sm">{label}</p>
    <p className="font-medium">
      {isAddress ? getFormatAddress(value) : `${value}%`}
    </p>
  </div>
);

const NFTDetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) => (
  <div>
    <span className="flex items-center gap-2">
      {icon}
      <p className="font-medium">{value}</p>
    </span>
    <p className="text-muted-foreground capitalize text-sm">{label}</p>
  </div>
);

const PricingDetailItem = ({
  icon = <XFI className="size-[18px]" />,
  value,
  label,
}: {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
}) => (
  <div className="flex flex-col gap-2">
    <span className="flex items-center gap-2">
      {icon}
      <p className="font-medium text-sm">{value} XFI</p>
    </span>
    <p className="text-muted-foreground capitalize text-sm">{label}</p>
  </div>
);

export function Details({ contractAddress, tokenId }: DetailsProps) {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;
  const [isActive, setIsActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { selectedFilter, setSelectedFilter } = useFilterStore();

  const {
    data: nftData,
    isLoading: isNFTDataLoading,
    isPending: isNFTDataPending,
    isError,
    error,
  } = useSingleNFTQuery({
    contractAddress: contractAddress as string,
    tokenId: tokenId as string,
  });

  const activeType = nftData?.activeType;
  const collectionFee = nftData?.collectionFee as Fee;
  const marketplaceFee = nftData?.marketplaceFee as Fee;
  const collectionDetails = nftData?.collectionDetails;
  const listingPricingData = nftData?.listingData;
  const auctionPricingData = nftData?.auctionData;

  const nft = nftData?.nft;
  const { metadata } = nft || {};
  const { description, name, image } = metadata || {};

  const isOwner = userAddress?.toLowerCase() === nft?.owner?.toLowerCase();
  console.log({ isOwner });

  useEffect(() => {
    const filter =
      activeType === "listing"
        ? singleNFTFilters[1]
        : activeType === "auction"
        ? singleNFTFilters[2]
        : singleNFTFilters[0];
    setSelectedFilter(filter);
  }, [activeType, nftData]);

  return (
    <div className="flex gap-6 pt-14">
      {isNFTDataLoading || isNFTDataPending ? (
        <>
          <div>Loading...</div>
        </>
      ) : (
        <>
          {/* image section */}
          <div className="w-[40%] relative h-[620px] gradient-box z-40 rounded-2xl">
            <Image
              src={"/nft_1.png"}
              width={500}
              height={700}
              alt="nft"
              className="object-cover relative size-full"
            />
            <div className="w-full h-[257px] absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-2xl via-black/80 from-background to-transparent" />
            <div className="absolute bottom-4 px-8 w-full flex justify-between items-center">
              <p className="font-medium">{name || "No Name"}</p>
              <span>
                <p className="font-medium">
                  {collectionDetails?.collectionName || "Unknown Collection"}
                </p>
                <p className="font-medium text-xs text-muted-foreground">
                  Collection Name
                </p>
              </span>
            </div>
          </div>

          {/* details section */}
          <div className="flex-1 flex flex-col gap-6 h-fit">
            <Header
              isActive={isActive}
              setIsActive={setIsActive}
              filters={singleNFTFilters}
              showRightSide={false}
              selectedFilter={selectedFilter}
            />
            <div className="flex flex-col gap-6">
              <p>{description || "No Description"}</p>
              <Line />

              <div className="bg-card rounded-xl p-4 flex items-center justify-between">
                {[
                  {
                    label: "Contract Address",
                    value: getFormatAddress(contractAddress),
                  },
                  { label: "Token Id", value: `#${tokenId}` },
                  { label: "Token Standard", value: "CRC-721" },
                  {
                    label: "Chain",
                    value: "CrossFi Mainnet",
                    icon: <XFI className="size-5" />,
                  },
                ].map((item, index) => (
                  <NFTDetailItem
                    key={`nft-detail-${index}`}
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r w-full from-border via-black/70 to-transparent p-3 rounded-2xl flex items-center justify-between gap-6 border border-border">
              <div className="w-1/2 flex flex-col gap-6 p-3">
                <p className="font-medium">Pricing Details</p>
                <div className="grid grid-cols-2 gap-5">
                  {selectedFilter !== singleNFTFilters[0] && (
                    <>
                      {/* Price Details */}
                      <PricingDetailItem
                        value={
                          activeType === "listing"
                            ? decimalOffChain(
                                listingPricingData?.[0]?.pricePerToken || "0"
                              )!
                            : decimalOffChain(
                                auctionPricingData?.[0]?.minimumBidAmount || "0"
                              )!
                        }
                        label={
                          activeType === "listing"
                            ? "Listing Price"
                            : "Minimum Bid Amount"
                        }
                      />

                      {/* Buyout Price (Auction only) */}
                      {activeType === "auction" && (
                        <PricingDetailItem
                          value={
                            decimalOffChain(
                              auctionPricingData?.[0]?.buyoutBidAmount || "0"
                            )!
                          }
                          label="Buyout Price"
                        />
                      )}

                      {/* Start Time */}
                      <PricingDetailItem
                        value={
                          activeType === "listing"
                            ? formatBlockchainTimestamp(
                                listingPricingData?.[0]?.startTimestamp || ""
                              )
                            : formatBlockchainTimestamp(
                                auctionPricingData?.[0]?.startTimestamp || ""
                              )
                        }
                        label={
                          activeType === "listing"
                            ? "Available From"
                            : "Starts From"
                        }
                      />

                      {/* End Time */}
                      <PricingDetailItem
                        value={
                          activeType === "listing"
                            ? formatBlockchainTimestamp(
                                listingPricingData?.[0]?.endTimestamp || ""
                              )
                            : formatBlockchainTimestamp(
                                auctionPricingData?.[0]?.endTimestamp || ""
                              )
                        }
                        label={
                          activeType === "listing" ? "Expires On" : "Ends On"
                        }
                      />
                    </>
                  )}

                  {selectedFilter === singleNFTFilters[0] && <div>No Pricing Data</div>}
                </div>
              </div>

              <div className="border border-border rounded-xl w-1/2">
                <div className="border-b border-b-border p-3">
                  <p>Market Details</p>
                </div>
                <div className="p-3 flex-col flex gap-3 mt-3">
                  <FeeRow
                    label="marketplace fee"
                    value={marketplaceFee?.percent?.toString()}
                  />
                  <FeeRow
                    label="marketplace fee address"
                    value={marketplaceFee?.address}
                    isAddress={true}
                  />
                  <FeeRow
                    label="collection fee"
                    value={collectionFee?.percent?.toString()}
                  />
                  <FeeRow
                    label="collection fee address"
                    value={collectionFee?.address}
                    isAddress={true}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center gap-3">
              {selectedFilter === singleNFTFilters[0] && (
                <Button shape="square" className="w-full">
                  Make Offer
                </Button>
              )}

              {selectedFilter === singleNFTFilters[1] && (
                <>
                  <Button variant="secondary" shape="square" className="w-1/2">
                    Make Offer
                  </Button>
                  <Button shape="square" className="w-1/2">
                    Buy Now
                  </Button>
                </>
              )}
              {selectedFilter === singleNFTFilters[2] && (
                <>
                  <Button variant="secondary" shape="square" className="w-1/2">
                    Buy Auction
                  </Button>
                  <Button shape="square" className="w-1/2">
                    Place Bid
                  </Button>
                </>
              )}

              {selectedFilter === singleNFTFilters[3] && (
                <Button shape="square" variant="error" className="w-full">
                  {activeType === "listing"
                    ? "Cancel Listing"
                    : "Cancel Auction"}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
