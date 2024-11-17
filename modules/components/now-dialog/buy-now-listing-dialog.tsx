import { Button, DialogBody, DialogHeader, DialogTitle } from "@/modules/app";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import React, { useEffect, useState } from "react";
import XFI from "@/assets/xfi.svg";
import { decimalOffChain } from "@/modules/blockchain";
import { useUserChainInfo } from "@/modules/query";
import { useToast } from "@/modules/app/hooks/useToast";
import { useBuyFromDirectListingMutation } from "@/modules/mutation";
import { useListingInfoStore, Fee } from "./store";
import { getPlatformFeeInfoCustom } from "@/modules/blockchain/global/global.blockchain";
import { MARKETPLACE_ADDRESS_TESTNET } from "@/utils/configs";

export function BuyNowListingDialog() {
  const toast = useToast();
  const { activeAccount } = useUserChainInfo();
  const { listingInfo } = useListingInfoStore();
  const { listingId, quantity, pricePerToken, tokenId, nft, assetContract } =
    listingInfo;
  const { metadata } = nft || {};
  const { image, name } = metadata || {};

  const [collectionFee, setCollectionFee] = useState<Fee>({
    address: "",
    percent: 0,
  });
  const [marketplaceFee, setMarketplaceFee] = useState<Fee>({
    address: "",
    percent: 0,
  });

  console.log({ listingInfo });

  const cta = "Buy Listing";

  const buyListingMutation = useBuyFromDirectListingMutation();

  const handleBuyListingNow = () => {
    if (!activeAccount) return toast.error("Please connect your wallet");
    if (!listingId || !quantity || !pricePerToken)
      return toast.error("Please fill in all fields");

    buyListingMutation.mutate({
      buyFromListing: {
        buyFor: activeAccount.address,
        listingId,
        quantity,
        totalPrice: decimalOffChain(pricePerToken) as unknown as string,
        nativeTokenValue: decimalOffChain(pricePerToken) as unknown as string,
      },
    });
  };

  const isDisabled = buyListingMutation.isPending;

  useEffect(() => {
    async function fetchFees() {
      const [collectionFee, marketplaceFee] = await Promise.all([
        getPlatformFeeInfoCustom({ contractAddress: assetContract }).catch(
          () => ({})
        ),
        getPlatformFeeInfoCustom({
          contractAddress: MARKETPLACE_ADDRESS_TESTNET,
        }).catch(() => ({})),
      ]);

      setCollectionFee(collectionFee as Fee);
      setMarketplaceFee(marketplaceFee as Fee);
    }
    fetchFees();
  }, [assetContract]);

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
            <ImageHolder src={image} alt={name} />
            <div className="bg-gradient-to-t from-background rounded-[10px] to-transparent absolute bottom-0 h-20 right-0 left-0 z-40" />
          </div>
          <div className="w-1/2 flex flex-col">
            <div className="bg-gradient-to-r rounded-xl border border-border from-border to-transparent p-3 flex flex-col gap-2">
              <span className="flex items-center gap-2 font-space">
                <XFI className="size-6" />
                <h3 className="text-2xl font-medium">
                  {decimalOffChain(pricePerToken)} XFI
                </h3>
              </span>
              <p className="text-muted-foreground text-sm">Listing Price</p>
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
                onClick={handleBuyListingNow}
                disabled={isDisabled}
                shape="square"
                className="w-full"
              >
                {cta}
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
