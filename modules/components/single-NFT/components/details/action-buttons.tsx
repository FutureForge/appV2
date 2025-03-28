import React from "react";
import { Button } from "@/modules/app";
import { DialogRoot, DialogContent, DialogTrigger } from "@/modules/app";
import {
  BuyNowListingDialog,
  BuyNowAuctionDialog,
} from "@/modules/components/collections";
import { Auction, Listing } from "@/modules/query/utils";
import { MakeOfferDialog } from "../dialogs/make-offer";
import { ListDialog } from "../dialogs/list-dialog";
import { AuctionDialog } from "../dialogs/auction-dialog";
import { PlaceBidDialog } from "../dialogs/place-bid";

// Action button props type
type ActionButtonProps = {
  variant?: "primary" | "secondary" | "error" | "tertiary" | "outline";
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  dialogContent?: React.ReactNode;
};

// Action Button component
export const ActionButton = ({
  variant = "primary",
  label,
  onClick,
  disabled = false,
  dialogContent,
}: ActionButtonProps) => {
  if (onClick) {
    return (
      <Button
        variant={variant}
        shape="square"
        className="w-full"
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </Button>
    );
  }

  if (dialogContent) {
    return (
      <DialogRoot>
        <DialogTrigger>
          <Button
            variant={variant}
            shape="square"
            className="w-full"
            disabled={disabled}
          >
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent className="min-[441px]:w-[700px]">
          {dialogContent}
        </DialogContent>
      </DialogRoot>
    );
  }

  return (
    <Button
      variant={variant}
      shape="square"
      className="w-full"
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

// Action Buttons Section
export const ActionButtonsSection = ({
  activeType,
  isOwner,
  isAuctionPendingPayout,
  isAuctionPayoutCollector,
  isWinningBidder,
  selectedFilter,
  image,
  name,
  tokenId,
  contractAddress,
  isApproved,
  listingInfo,
  auctionInfo,
  handleCancelListing,
  handleCancelAuction,
  handleCollectAuctionPayout,
  isDisabled,
  setIsDialogOpen,
}: {
  activeType?: string;
  isOwner: boolean;
  isAuctionPendingPayout: boolean;
  isAuctionPayoutCollector: boolean;
  isWinningBidder: boolean;
  selectedFilter: string;
  image?: string;
  name?: string;
  tokenId: string;
  contractAddress: string;
  isApproved?: boolean;
  listingInfo: Listing;
  auctionInfo: Auction;
  handleCancelListing: () => void;
  handleCancelAuction: () => void;
  handleCollectAuctionPayout: () => void;
  isDisabled: boolean;
  setIsDialogOpen: () => void;
}) => {
  // Not listed section
  if (selectedFilter === "Not Listed") {
    if (!isOwner) {
      return (
        <ActionButton
          label="Make Offer"
          dialogContent={
            <MakeOfferDialog
              src={image!}
              alt={name!}
              name={name!}
              tokenId={tokenId}
              assetContract={contractAddress}
              setIsDialogOpen={setIsDialogOpen}
            />
          }
        />
      );
    }

    if (!isAuctionPendingPayout) {
      return (
        <div className="w-full flex items-center justify-between max-[500px]:flex-col gap-4">
          <ActionButton
            variant="secondary"
            label="List NFT"
            dialogContent={
              <ListDialog
                src={image!}
                alt={name!}
                name={name!}
                isApproved={isApproved!}
                tokenId={tokenId}
                setIsDialogOpen={setIsDialogOpen}
                assetContract={contractAddress}
              />
            }
          />
          <ActionButton
            label="Auction NFT"
            variant="primary"
            dialogContent={
              <AuctionDialog
                src={image!}
                alt={name!}
                name={name!}
                isApproved={isApproved!}
                tokenId={tokenId}
                setIsDialogOpen={setIsDialogOpen}
                assetContract={contractAddress}
              />
            }
          />
        </div>
      );
    }
  }

  // Listed section
  if (selectedFilter === "Listed") {
    if (!isOwner) {
      return (
        <div className="w-full flex items-center justify-between max-[500px]:flex-col gap-4">
          <ActionButton
            variant="secondary"
            label="Make Offer"
            dialogContent={
              <MakeOfferDialog
                src={image!}
                alt={name!}
                name={name!}
                tokenId={tokenId}
                setIsDialogOpen={setIsDialogOpen}
                assetContract={contractAddress}
              />
            }
          />
          <ActionButton
            label="Buy Now"
            dialogContent={
              <BuyNowListingDialog setIsDialogOpen={setIsDialogOpen} />
            }
          />
        </div>
      );
    }

    return (
      <ActionButton
        variant="error"
        label="Cancel Listing"
        onClick={handleCancelListing}
        disabled={isDisabled}
      />
    );
  }

  // Auction section
  if (selectedFilter === "Auction") {
    if (!isOwner) {
      return (
        <div className="w-full flex items-center justify-between max-[500px]:flex-col gap-4">
          <ActionButton
            variant="secondary"
            label="Buy Auction"
            dialogContent={
              <BuyNowAuctionDialog setIsDialogOpen={setIsDialogOpen} />
            }
          />
          <ActionButton
            label="Place Bid"
            dialogContent={<PlaceBidDialog setIsDialogOpen={setIsDialogOpen} />}
          />
        </div>
      );
    }

    return (
      <ActionButton
        variant="error"
        label="Cancel Auction"
        onClick={handleCancelAuction}
        disabled={isDisabled}
      />
    );
  }

  // Expired section
  if (selectedFilter === "Expired") {
    if (isOwner) {
      return (
        <ActionButton
          variant="error"
          label={`Cancel Expired ${
            listingInfo !== null ? "Listing" : "Auction"
          }`}
          onClick={() => {
            if (listingInfo !== null) handleCancelListing();
            if (auctionInfo !== null) handleCancelAuction();
          }}
          disabled={isDisabled}
        />
      );
    }

    if (listingInfo !== null && auctionInfo === null) {
      return <ActionButton label="Listing Expired" disabled={true} />;
    }

    if (!isAuctionPayoutCollector && !isWinningBidder && auctionInfo !== null) {
      return <ActionButton label="Auction Expired" disabled={true} />;
    }
  }

  // Pending Payout section
  if (selectedFilter === "Pending Payout") {
    if (isAuctionPayoutCollector && isAuctionPendingPayout) {
      return (
        <ActionButton
          label="Claim Auction Payout"
          onClick={handleCollectAuctionPayout}
          disabled={isDisabled}
        />
      );
    }

    if (isOwner && !isAuctionPayoutCollector && isAuctionPendingPayout) {
      return (
        <ActionButton
          label="Waiting for Winning Bidder to Claim"
          disabled={true}
        />
      );
    }
  }

  return null;
};
