import { Button, DialogBody, DialogHeader, DialogTitle } from "@/modules/app";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import React from "react";
import XFI from "@/assets/xfi.svg";
import { ExtraProps } from "@/modules/app/component/nft-card/utils/nft-card.utils";
import { decimalOffChain } from "@/modules/blockchain";

type AuctionDialogProps = {
  src: string;
  alt: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  name: string;
  tokenId: string;
  props: ExtraProps;
};

export function AuctionDialog({
  src,
  alt,
  onClick,
  name,
  tokenId,
  props,
}: AuctionDialogProps) {
  const { collectionFee, disabled, marketplaceFee, price } = props;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {name} - {tokenId}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex w-full gap-6">
          <div className="relative">
            <ImageHolder src={src} alt={alt} />
            <div className="bg-gradient-to-t from-background rounded-[10px] to-transparent absolute bottom-0 h-20 right-0 left-0 z-40" />
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="bg-gradient-to-r rounded-xl border border-border from-border to-transparent p-3 flex flex-col gap-2">
              <span className="flex items-center gap-2 font-space">
                <XFI className="size-6" />
                <h3 className="text-2xl font-medium">
                  {decimalOffChain(price)} XFI
                </h3>
              </span>
              <p className="text-muted-foreground text-sm">Auction Price</p>
            </div>

            <div className="w-full mt-6">
              <span className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Collection Fee</p>
                <p className="text-sm font-medium">{collectionFee.percent}%</p>
              </span>
              <span className="flex items-center justify-between mt-3">
                <p className="text-muted-foreground text-sm">Marketplace Fee</p>
                <p className="text-sm font-medium">{marketplaceFee.percent}%</p>
              </span>
            </div>
            <div className="flex items-end justify-end w-full mt-auto">
              <Button
                onClick={onClick}
                disabled={disabled}
                shape="square"
                className="w-full"
              >
                Buy Auction
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
