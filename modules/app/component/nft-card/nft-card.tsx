import React, { useState } from "react";
import { motion } from "framer-motion";
import { ImageHolder } from "@/modules/components/home/components/collections-nft-card/collections-nft-card";
import { getNFTCardInfo, NFTCardProps } from "./utils/nft-card.utils";
import { DialogContent, DialogRoot, DialogTrigger } from "../..";
import { cn } from "../../utils";
import { AuctionDialog, ListingDialog } from "@/modules/components/collections";
// icons
import XFI from "@/assets/xfi.svg";
import LinkIcon from "@/assets/arrow-right-up-line.svg";

export function NFTCard(props: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    onClick,
    cta,
    data,
    type,
    status,
    extraCTA,
    extraOnClick,
    ctaStyles,
    extraProps,
    extraTitle,
    extraInfo,
  } = props;
  const { metadata } = data.nft || {};
  const image = metadata?.image || "";
  const name = metadata?.name || "";
  const tokenId = data.tokenId || "";

  // console.log({ data, type, status });

  // console.log("====================================");
  // console.log(data, type, "hello");
  // console.log("====================================");

  const { title1, title2, info1, info2 } = getNFTCardInfo({
    type: type,
    data,
  });

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-card w-[293px] border group cursor-pointer border-border rounded-2xl  flex flex-col gap-6 p-4 backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-white">
          {name} - {tokenId}
        </p>
        {status && (
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full w-fit first-letter:capitalize",
              {
                "bg-primary text-white": status === "auctioned",
                "bg-success text-white": status === "listed",
              }
            )}
          >
            {status}
          </span>
        )}
      </div>

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
            <XFI className="size-4" />
            <p className="text-lg font-medium text-white">
              {info1 || extraInfo}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {title1 || extraTitle}
          </p>
        </div>
        <div>
          <p className="text-lg font-medium text-white">{info2 || extraInfo}</p>
          <p className="text-sm text-muted-foreground">
            {title2 || extraTitle}
          </p>
        </div>
      </div>
      {(cta || extraCTA) && (
        <div className="w-full flex items-center justify-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {cta && (
            <motion.button
              onClick={onClick}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 40,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "bg-primary text-white w-fit rounded-lg flex items-center gap-1 py-2 px-3 text-sm font-medium hover:bg-primary/95",
                ctaStyles,
                { "bg-border hover:bg-border/95": extraCTA }
              )}
            >
              {cta} <LinkIcon className="size-4 text-foreground" />
            </motion.button>
          )}
          {extraCTA && (
            <DialogRoot open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger>
                <motion.button
                  // onClick={extraOnClick}
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{
                    y: isHovered ? 0 : 40,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="bg-primary text-white w-fit rounded-lg flex items-center gap-1 py-2 px-3 text-sm font-medium"
                >
                  {extraCTA} <LinkIcon className="size-4 text-foreground" />
                </motion.button>
              </DialogTrigger>
              <DialogContent className="w-[564px]">
                {status === "listed" && (
                  <ListingDialog
                    src={image}
                    onClick={extraOnClick}
                    alt={name}
                    name={name}
                    tokenId={tokenId}
                    props={extraProps!}
                  />
                )}
                {status === "auctioned" && (
                  <AuctionDialog
                    src={image}
                    onClick={extraOnClick}
                    alt={name}
                    name={name}
                    tokenId={tokenId}
                    props={extraProps!}
                  />
                )}
              </DialogContent>
            </DialogRoot>
          )}
        </div>
      )}
    </div>
  );
}
