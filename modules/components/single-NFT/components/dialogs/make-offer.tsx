import {
  Button,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Label,
  TextField,
} from "@/modules/app";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import React, { useState } from "react";
import XFI from "@/assets/xfi.svg";
import { decimalOffChain } from "@/modules/blockchain";
import Check from "@/assets/Checkbox [1.0].svg";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
import { TransitionLinks } from "@/modules/app/component/nav/transition-links";
import { useUserChainInfo } from "@/modules/query";

type MakeOfferDialogProps = {
  src: string;
  alt: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  name: string;
  tokenId: string;
};

const notes = [
  [
    "Offers are made in WXFI.",
    "Don’t have WXFI? Don’t worry, we’ll handle the conversion for you.",
  ],

  ["You can also", "swap for WXFI", "manually."],
];

// TODO: add the logic to make an offer

export function MakeOfferDialog({
  src,
  alt,
  name,
  tokenId,
}: MakeOfferDialogProps) {
  const { activeAccount } = useUserChainInfo();
  const [value, setValue] = useState("");

  const isDisabled = !value || !activeAccount;

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
                src={src}
                client={client}
                alt={alt}
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
              <Label>Offer Amount</Label>
              <TextField
                value={value}
                onChange={(e) => setValue(e.target.value)}
                containerClass="bg-transparent rounded-lg"
                placeholder="Amount"
              />
            </form>

            <div className="flex w-full items-end justify-end mt-6">
              <Button disabled={isDisabled} className="w-full" shape="square">
                {!activeAccount ? "Connect Your Wallet" : "Make Offer"}
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
