import {
  Button,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Label,
  TextField,
} from "@/modules/app";
import React, { useState } from "react";
import Check from "@/assets/Checkbox [1.0].svg";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import { TransitionLinks } from "@/modules/app/component/nav/transition-links";
import { getUserNativeBalance, useUserChainInfo } from "@/modules/query";
import { useAuctionInfoStore } from "@/modules/components/now-dialog/store";
import { useToast } from "@/modules/app/hooks/useToast";
import { useBidInAuctionMutation } from "@/modules/mutation";
import { decimalOffChain } from "@/modules/blockchain";

import XFI from "@/assets/xfi.svg";

export function PlaceBidDialog({
  setIsDialogOpen,
}: {
  setIsDialogOpen: (open: boolean) => void;
}) {
  const toast = useToast();

  const [value, setValue] = useState("");
  const [error, setError] = useState<string>("");

  const { balanceData } = getUserNativeBalance();
  const { activeAccount } = useUserChainInfo();
  const { auctionInfo } = useAuctionInfoStore();
  const { auctionId, tokenId, nft, buyoutBidAmount, minimumBidAmount } =
    auctionInfo;
  const { metadata } = nft || {};
  const { image, name } = metadata || {};

  const bidInAuctionMutation = useBidInAuctionMutation();

  const handleBuyAuctionNow = () => {
    if (!activeAccount) return toast.error("Please connect your wallet");
    if (!auctionId || !buyoutBidAmount)
      return toast.error("Please fill in all fields");

    bidInAuctionMutation.mutate(
      {
        auctionId,
        bidAmount: value,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
        onError: () => {
          setIsDialogOpen(false);
        },
      }
    );
  };

  const isDisabled =
    bidInAuctionMutation.isPending ||
    !value ||
    !auctionId ||
    !buyoutBidAmount ||
    error !== "";

  const notes = [
    [
      "Bids must be greater than the minimum bid amount.",
      `Minimum bid amount: ${decimalOffChain(minimumBidAmount as string)} XFI`,
    ],
    [
      "Bids must be less than the buyout price.",
      `Buyout price: ${decimalOffChain(buyoutBidAmount as string)} XFI`,
    ],
  ];
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {name} - {tokenId}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex w-full gap-6">
          <div className="relative w-1/2">
            <div className="w-full relative h-full border-2 border-border z-40 rounded-2xl">
              <MediaRenderer
                src={image!}
                client={client}
                alt={name!}
                className="object-cover w-full absolute inset-0 size-full"
              />
              <div className="w-full h-[257px] absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-2xl via-black/80 from-background to-transparent" />
            </div>
          </div>
          <div className="w-1/2 flex flex-col h-full">
            <div className="bg-gradient-to-r from-border to-transparent p-4 rounded-2xl border border-border flex flex-col gap-6">
              <p className="font-medium">Note:</p>
              <div className="flex flex-col gap-4">
                {notes[0].map((note) => (
                  <p key={note} className="flex items-center w-full">
                    <span className="min-w-2.5">
                      <Check className="min-w-2.5 mr-2" />
                    </span>
                    <span className="text-sm font-medium w-[273px]">
                      {note}
                    </span>
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {notes[1].map((note, index) => (
                  <p key={note} className="flex">
                    {index === 0 && (
                      <span className="min-w-2.5">
                        <Check className="min-w-2.5 mr-2" />
                      </span>
                    )}
                    {index === 1 ? (
                      <TransitionLinks
                        href="/your-link"
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        {note}
                      </TransitionLinks>
                    ) : (
                      <span className="text-sm font-medium">{note}</span>
                    )}
                  </p>
                ))}
              </div>
            </div>

            <form className="flex flex-col mt-6 gap-2">
              <Label>Bid Amount</Label>
              <div className="relative">
                <TextField
                  value={value}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const minBid = Number(
                      decimalOffChain(minimumBidAmount as string)
                    );
                    const maxBid = Number(
                      decimalOffChain(buyoutBidAmount as string)
                    );

                    setValue(newValue);

                    if (Number(newValue) < minBid) {
                      setError(`Bid must be at least ${minBid} XFI`);
                    } else if (Number(newValue) > maxBid) {
                      setError(`Bid cannot exceed ${maxBid} XFI`);
                    } else {
                      setError("");
                    }
                  }}
                  containerClass="bg-transparent rounded-lg pr-20"
                  placeholder={`Balance ${Number(balanceData?.displayValue).toFixed(2)} ${balanceData?.symbol}`}
                  type="number"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <XFI className="size-4" />
                  <span className="text-gray-400">XFI</span>
                </div>
              </div>
              {error && (
                <span className="text-red-500 text-sm mt-1">{error}</span>
              )}
            </form>

            <div className="flex w-full items-end justify-end mt-6">
              <Button
                disabled={isDisabled}
                className="w-full"
                shape="square"
                onClick={handleBuyAuctionNow}
              >
                Make Bid
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
