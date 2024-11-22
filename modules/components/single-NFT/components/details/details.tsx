import {
  Button,
  DialogContent,
  DialogRoot,
  DialogTrigger,
} from "@/modules/app";
import React, { useEffect, useState } from "react";
import { formatBlockchainTimestamp, getFormatAddress } from "@/utils/functions";
import { useFilterStore } from "../../store";
import {
  useCheckApprovalStatusQuery,
  useSingleNFTQuery,
  useUserChainInfo,
} from "@/modules/query";
import { decimalOffChain } from "@/modules/blockchain";
import { MediaRenderer } from "thirdweb/react";
import { chainInfo, client, DEAD_ADDRESS } from "@/utils/configs";
import { TransitionLinks } from "@/modules/app/component/nav/transition-links";
import { MakeOfferDialog } from "../dialogs/make-offer";
import { DetailsSkeleton } from "../skeleton/details-skeleton";
import { PlaceBidDialog } from "../dialogs/place-bid";
import { ListDialog } from "../dialogs/list-dialog";
import Link from "next/link";
import { AuctionDialog } from "../dialogs/auction-dialog";
import {
  BuyNowAuctionDialog,
  BuyNowListingDialog,
} from "@/modules/components/collections";
import {
  Fee,
  useAuctionInfoStore,
  useListingInfoStore,
} from "@/modules/components/now-dialog/store";
import { Auction, Listing } from "@/utils/types/graphql";
import {
  useCancelAuctionMutation,
  useCancelDirectListingMutation,
  useCollectAuctionPayoutMutation,
} from "@/modules/mutation";

// icons
import Line from "@/assets/line.svg";
import XFI from "@/assets/xfi.svg";
import LinkIcon from "@/assets/arrow-right-up-line.svg";

export const singleNFTFilters = [
  "Not Listed",
  "Listed",
  "Auction",
  "Expired",
  "Pending Payout",
];

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
    <p className="font-medium text-sm">
      {isAddress ? getFormatAddress(value) : `${value}%`}
    </p>
  </div>
);

const NFTDetailItem = ({
  label,
  value,
  icon,
  link,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  link?: string;
}) => (
  <div>
    <span className="flex items-center gap-2">
      {icon}
      <p className="font-medium">
        {link ? (
          <Link
            href={link}
            className="font-medium text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </Link>
        ) : (
          value
        )}
      </p>
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
}) => {
  const noSymbol =
    label !== "Available From" &&
    label !== "Starts From" &&
    label !== "Expires On" &&
    label !== "Ends On";
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-2">
        {icon && icon}
        <p className="font-medium text-sm">
          {value}
          {noSymbol && " XFI"}
        </p>
      </span>
      <p className="text-muted-foreground capitalize text-sm">{label}</p>
    </div>
  );
};

export function Details({ contractAddress, tokenId }: DetailsProps) {
  const { activeAccount } = useUserChainInfo();
  const userAddress = activeAccount?.address;

  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [isAuctionDialogOpen, setIsAuctionDialogOpen] = useState(false);
  const [isMakeOfferDialogOpen, setIsMakeOfferDialogOpen] = useState(false);
  const [isBuyNowListingDialogOpen, setIsBuyNowListingDialogOpen] =
    useState(false);
  const [isBuyNowAuctionDialogOpen, setIsBuyNowAuctionDialogOpen] =
    useState(false);
  const [isPlaceBidDialogOpen, setIsPlaceBidDialogOpen] = useState(false);

  const { selectedFilter, setSelectedFilter } = useFilterStore();
  const { setListingInfo, listingInfo } = useListingInfoStore();
  const { setAuctionInfo, auctionInfo } = useAuctionInfoStore();

  const cancelListingMutation = useCancelDirectListingMutation();
  const cancelAuctionMutation = useCancelAuctionMutation();
  const collectAuctionPayoutMutation = useCollectAuctionPayoutMutation();

  const {
    data: nftData,
    isLoading: isNFTDataLoading,
    isPending: isNFTDataPending,
    isError,
  } = useSingleNFTQuery({
    contractAddress: contractAddress as string,
    tokenId: tokenId as string,
  });

  const isApproved = useCheckApprovalStatusQuery({
    collectionContractAddress: contractAddress as string,
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

  const isAuctionExpired = auctionPricingData?.isAuctionExpired;
  const isAuctionPendingPayout = nftData?.isAuctionPendingPayout;

  const isAuctionPayoutCollector =
    auctionPricingData?.auctionCreator?.toLowerCase() ===
    userAddress?.toLowerCase();

  const isOwner =
    listingPricingData !== undefined
      ? userAddress?.toLowerCase() ===
        listingPricingData?.listingCreator?.toLowerCase()
      : auctionPricingData !== undefined
      ? userAddress?.toLowerCase() ===
        auctionPricingData?.auctionCreator?.toLowerCase()
      : userAddress?.toLowerCase() === nft?.owner?.toLowerCase();

  const owner =
    listingPricingData !== undefined
      ? listingPricingData.listingCreator?.toLowerCase()
      : auctionPricingData !== undefined
      ? auctionPricingData.auctionCreator?.toLowerCase()
      : nft?.owner?.toLowerCase();

  const isWinningBidder =
    userAddress?.toLowerCase() ===
    auctionPricingData?.winningBid?.bidder?.toLowerCase();

  const getListingStatus = () => {
    if (activeType === "listing")
      return { type: "Direct Listing", color: "text-success" };
    if (activeType === "auction")
      return { type: "English Auction", color: "text-blue-500" };
    if (activeType === "expired")
      return { type: "Expired", color: "text-red-500" };
    if (activeType === "pending-payout")
      return { type: "Pending Payout", color: "text-yellow-500" };
    return { type: "Not Listed", color: "text-muted-foreground" };
  };

  const handleCancelListing = () => {
    cancelListingMutation.mutate({ listingId: listingInfo.listingId });
  };

  const handleCancelAuction = () => {
    cancelAuctionMutation.mutate({ auctionId: auctionInfo.auctionId });
  };

  const handleCollectAuctionPayout = () => {
    const auctionId = auctionPricingData?.auctionId;

    if (!auctionId) return;

    collectAuctionPayoutMutation.mutate({
      auctionId,
    });
  };

  const isDisabled =
    cancelListingMutation.isPending ||
    cancelAuctionMutation.isPending ||
    collectAuctionPayoutMutation.isPending;

  useEffect(() => {
    const filter =
      activeType === "listing"
        ? singleNFTFilters[1]
        : activeType === "auction"
        ? singleNFTFilters[2]
        : activeType === "expired"
        ? singleNFTFilters[3]
        : activeType === "pending-payout"
        ? singleNFTFilters[4]
        : singleNFTFilters[0];
    setSelectedFilter(filter);
  }, [activeType, nftData]);

  useEffect(() => {
    setListingInfo(listingPricingData as Listing);
    setAuctionInfo(auctionPricingData as Auction);
  }, [listingPricingData, auctionPricingData]);

  return (
    <div className="flex gap-6 pt-14 max-[910px]:flex-col">
      {isNFTDataLoading || isNFTDataPending || isError ? (
        <>
          <DetailsSkeleton />
        </>
      ) : (
        <>
          {/* image section */}
          <div className="w-[40%] max-[910px]:w-full flex flex-col gap-6">
            {collectionDetails && (
              <div className="w-full bg-tertiary p-4 rounded-xl flex items-center justify-between">
                <span>
                  <p className="font-medium">
                    {collectionDetails?.collectionName}
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Collection
                  </p>
                </span>
                <TransitionLinks
                  href={`/collections/${collectionDetails?.collectionAddress}`}
                  className="text-muted-foreground hover:text-foreground group duration-300 transition-all ease-in-out flex items-center gap-1"
                >
                  View Collection{" "}
                  <LinkIcon className="size-4 text-muted-foreground group-hover:text-foreground duration-300 transition-all ease-in-out" />
                </TransitionLinks>
              </div>
            )}
            <div className="w-full relative h-full z-40 rounded-2xl border-2 border-border overflow-hidden">
              <MediaRenderer
                src={image}
                client={client}
                alt={name}
                className="object-cover w-full h-full aspect-square"
              />
              <div className="w-full h-[257px] absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-2xl via-black/80 from-background to-transparent" />
            </div>
          </div>

          {/* details section */}
          <div className="flex-1 max-[1200px]:w-[55%] max-[910px]:w-full flex flex-col gap-6 h-full">
            {/** name section */}
            <div className="flex w-full items-center justify-between">
              <span>
                <p className="font-medium">{name || "No Name"}</p>
                <p className="text-muted-foreground text-sm  mt-2">
                  Owned By:{" "}
                  <Link
                    href={`${chainInfo?.blockExplorers?.[0]?.url}/address/${owner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary"
                  >
                    {getFormatAddress(owner || "")}
                  </Link>
                </p>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getListingStatus().color
                }`}
              >
                {getListingStatus().type}
              </span>
            </div>
            <Line />

            {/** description section */}
            <div className="flex flex-col gap-6">
              <p>{description || "No Description"}</p>
              <Line />

              <div className="bg-card rounded-xl p-4 flex items-center justify-between max-lg:grid grid-cols-2 gap-y-2">
                {[
                  {
                    label: "Contract Address",
                    value: getFormatAddress(contractAddress),
                    link: `${chainInfo?.blockExplorers?.[0]?.url}/address/${contractAddress}`,
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
                    link={item.link}
                  />
                ))}
              </div>
            </div>

            {/** pricing section */}
            <div className="bg-gradient-to-r w-full from-border via-black/70 to-transparent p-3 rounded-2xl flex items-center max-lg:flex-col justify-between gap-6 border border-border">
              <div className="w-1/2 max-lg:w-full flex flex-col gap-6 p-3">
                <p className="font-medium">Pricing Details</p>
                <div className="grid grid-cols-2 gap-5">
                  {selectedFilter !== singleNFTFilters[0] && (
                    <>
                      {/* Price Details */}
                      <PricingDetailItem
                        value={
                          activeType === "listing"
                            ? decimalOffChain(listingInfo?.pricePerToken)!
                            : decimalOffChain(auctionInfo?.minimumBidAmount)!
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
                          value={decimalOffChain(auctionInfo?.buyoutBidAmount)!}
                          label="Buyout Price"
                        />
                      )}

                      {/* Start Time */}
                      <PricingDetailItem
                        icon={null}
                        value={
                          activeType === "listing"
                            ? formatBlockchainTimestamp(
                                listingInfo?.startTimestamp
                              )
                            : formatBlockchainTimestamp(
                                auctionInfo?.startTimestamp
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
                        icon={null}
                        value={
                          activeType === "listing"
                            ? formatBlockchainTimestamp(
                                listingInfo?.endTimestamp
                              )
                            : formatBlockchainTimestamp(
                                auctionInfo?.endTimestamp
                              )
                        }
                        label={
                          activeType === "listing" ? "Expires On" : "Ends On"
                        }
                      />
                    </>
                  )}

                  {selectedFilter === singleNFTFilters[0] && (
                    <div className="col-span-2 flex items-center w-full p-6 bg-tertiary/30 rounded-xl border border-border/50">
                      <p className="text-sm text-muted-foreground">
                        This NFT is neither auctioned nor listed. You can make
                        an offer at any time.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-border rounded-xl w-1/2 max-lg:w-full">
                <div className="border-b border-b-border p-3">
                  <p>Market Details</p>
                </div>
                <div className="p-3 flex-col flex gap-3 mt-3">
                  <FeeRow
                    label="marketplace fee"
                    value={marketplaceFee?.percent?.toString() || "0"}
                  />
                  <FeeRow
                    label="marketplace fee address"
                    value={marketplaceFee?.address || DEAD_ADDRESS}
                    isAddress={true}
                  />
                  <FeeRow
                    label="collection fee"
                    value={collectionFee?.percent?.toString() || "0"}
                  />
                  <FeeRow
                    label="collection fee address"
                    value={collectionFee?.address || DEAD_ADDRESS}
                    isAddress={true}
                  />
                </div>
              </div>
            </div>

            {/** actions section */}
            <div className="w-full flex items-center gap-3">
              {/** make offer section for non-owner*/}
              {selectedFilter === singleNFTFilters[0] && !isOwner && (
                <DialogRoot
                  open={isMakeOfferDialogOpen}
                  onOpenChange={setIsMakeOfferDialogOpen}
                >
                  <DialogTrigger>
                    <Button shape="square" className="w-full">
                      Make Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[787px]">
                    <MakeOfferDialog
                      src={image!}
                      alt={name!}
                      name={name!}
                      tokenId={tokenId}
                      setIsDialogOpen={setIsMakeOfferDialogOpen}
                      assetContract={contractAddress}
                    />
                  </DialogContent>
                </DialogRoot>
              )}

              {/** list || auction section for nft owner*/}
              {selectedFilter === singleNFTFilters[0] &&
                isOwner &&
                !isAuctionPendingPayout && (
                  <div className="w-full flex items-center justify-between max-[500px]:flex-col gap-4">
                    <DialogRoot
                      open={isListingDialogOpen}
                      onOpenChange={setIsListingDialogOpen}
                    >
                      <DialogTrigger>
                        <Button
                          shape="square"
                          className="w-full"
                          variant="secondary"
                        >
                          List NFT
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[700px]">
                        <ListDialog
                          src={image!}
                          alt={name!}
                          name={name!}
                          isApproved={isApproved!}
                          tokenId={tokenId}
                          assetContract={contractAddress}
                          setIsDialogOpen={setIsListingDialogOpen}
                        />
                      </DialogContent>
                    </DialogRoot>

                    <DialogRoot
                      open={isAuctionDialogOpen}
                      onOpenChange={setIsAuctionDialogOpen}
                    >
                      <DialogTrigger>
                        <Button shape="square" className="w-full">
                          Auction NFT
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[700px]">
                        <AuctionDialog
                          src={image!}
                          alt={name!}
                          name={name!}
                          isApproved={isApproved!}
                          tokenId={tokenId}
                          assetContract={contractAddress}
                          setIsDialogOpen={setIsAuctionDialogOpen}
                        />
                      </DialogContent>
                    </DialogRoot>
                  </div>
                )}

              {/** make offer section for listing for non-owner*/}
              {selectedFilter === singleNFTFilters[1] && !isOwner && (
                <div className="w-full flex items-center justify-between max-[500px]:flex-col gap-4">
                  <DialogRoot
                    open={isMakeOfferDialogOpen}
                    onOpenChange={setIsMakeOfferDialogOpen}
                  >
                    <DialogTrigger>
                      <Button
                        variant="secondary"
                        shape="square"
                        className="w-1/2"
                      >
                        Make Offer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[700px]">
                      <MakeOfferDialog
                        src={image!}
                        alt={name!}
                        name={name!}
                        tokenId={tokenId}
                        setIsDialogOpen={setIsMakeOfferDialogOpen}
                        assetContract={contractAddress}
                      />
                    </DialogContent>
                  </DialogRoot>

                  <DialogRoot
                    open={isBuyNowListingDialogOpen}
                    onOpenChange={setIsBuyNowListingDialogOpen}
                  >
                    <DialogTrigger>
                      <Button shape="square" className="w-1/2">
                        Buy Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[564px]">
                      <BuyNowListingDialog
                        setIsDialogOpen={setIsBuyNowListingDialogOpen}
                      />
                    </DialogContent>
                  </DialogRoot>
                </div>
              )}

              {/* cancel listing/auction section for owner */}
              {(selectedFilter === singleNFTFilters[1] ||
                selectedFilter === singleNFTFilters[2]) &&
                isOwner && (
                  <Button
                    disabled={isDisabled}
                    shape="square"
                    className="w-full"
                    variant="error"
                    onClick={() => {
                      if (activeType === "listing") {
                        handleCancelListing();
                      }

                      if (activeType === "auction") {
                        handleCancelAuction();
                      }
                    }}
                  >
                    Cancel {activeType === "listing" ? "Listing" : "Auction"}
                  </Button>
                )}

              {/* listing expired for non-owner */}
              {selectedFilter === singleNFTFilters[3] &&
                !isOwner &&
                listingInfo !== undefined &&
                nftData?.isActiveTypeExpired && (
                  <Button disabled={true} shape="square" className="w-full">
                    Listing Expired
                  </Button>
                )}

              {/* auction payout for auction bidder */}
              {selectedFilter === singleNFTFilters[4] &&
                isAuctionPayoutCollector &&
                isAuctionPendingPayout && (
                  <Button
                    disabled={isDisabled}
                    shape="square"
                    className="w-full"
                    onClick={handleCollectAuctionPayout}
                  >
                    Claim Auction Payout
                  </Button>
                )}

              {/* auction expired for owner */}
              {selectedFilter === singleNFTFilters[4] &&
                isOwner &&
                !isAuctionPayoutCollector &&
                (isAuctionPendingPayout || isAuctionExpired) && (
                  <Button disabled={true} shape="square" className="w-full">
                    Waiting for Winning Bidder to Claim
                  </Button>
                )}

              {/* auction expired for non-owner */}
              {(selectedFilter === singleNFTFilters[4] ||
                selectedFilter === singleNFTFilters[3]) &&
                !isOwner &&
                !isAuctionPayoutCollector &&
                !isWinningBidder && (
                  <Button disabled={true} shape="square" className="w-full">
                    Auction Expired
                  </Button>
                )}

              {/* active auction for non-owner */}
              {selectedFilter === singleNFTFilters[2] && !isOwner && (
                <div className="w-full flex items-center justify-between max-[500px]:flex-col gap-4">
                  <DialogRoot
                    open={isBuyNowAuctionDialogOpen}
                    onOpenChange={setIsBuyNowAuctionDialogOpen}
                  >
                    <DialogTrigger>
                      <Button
                        variant="secondary"
                        shape="square"
                        className="w-1/2"
                      >
                        Buy Auction
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <BuyNowAuctionDialog
                        setIsDialogOpen={setIsBuyNowAuctionDialogOpen}
                      />
                    </DialogContent>
                  </DialogRoot>

                  <DialogRoot
                    open={isPlaceBidDialogOpen}
                    onOpenChange={setIsPlaceBidDialogOpen}
                  >
                    <DialogTrigger>
                      <Button shape="square" className="w-1/2">
                        Place Bid
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[700px]">
                      <PlaceBidDialog
                        setIsDialogOpen={setIsPlaceBidDialogOpen}
                      />
                    </DialogContent>
                  </DialogRoot>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
