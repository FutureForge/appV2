import React, { useState } from "react";
import { motion } from "framer-motion";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";
// icons
import XFI from "@/assets/xfi.svg";
import { Collection } from "@/utils/types/collection/collection.type";

export type CollectionWithoutOwnerBackground = Omit<
  Collection,
  | "collectionBackgroundImage"
  | "collectionOwnerAddress"
  | "collectionDescription"
  | "_id"
>;
export type CollectionNFTCardProps = CollectionWithoutOwnerBackground & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  cta?: string;
};
export function CollectionsNFTCard(props: CollectionNFTCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    collectionImage,
    collectionName,
    onClick,
    cta,
    floorPrice,
    totalVolume,
  } = props;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-card w-[293px] border group cursor-pointer border-border rounded-2xl  flex flex-col gap-6 p-4 backdrop-blur-2xl"
    >
      <p className="font-medium text-white">{collectionName}</p>

      <div className="w-[261px] h-[220px] relative overflow-hidden">
        <ImageHolder
          src={collectionImage}
          alt={collectionName}
          className="group-hover:scale-[1.01]"
        />
        {isHovered && (
          <div
            className="bg-black/50 absolute inset-0 group-hover:scale-[1.01]"
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
            <XFI />
            <p className="text-lg font-medium text-white">18.71 XFI</p>
          </div>
          <p className="text-sm text-muted-foreground">Floor Price</p>
        </div>
        <div>
          <p className="text-lg font-medium text-white">19 XFI</p>
          <p className="text-sm text-muted-foreground">Volume</p>
        </div>
      </div>
      {cta && (
        <div className="w-full flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.button
            onClick={onClick}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 40,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="bg-white text-black w-fit rounded-lg py-2 px-3 text-sm font-medium"
          >
            {cta}
          </motion.button>
        </div>
      )}
    </div>
  );
}

export function ImageHolder({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "263px",
        height: "221px",
        overflow: "hidden",
      }}
    >
      {/* SVG Clip Path */}
      <svg width="263" height="221">
        <defs>
          <clipPath id="clip-path">
            <path
              d="M240.781 1H168.03C165.188 1 162.48 2.20945 160.583 4.32607L158.91 6.19251C157.013 8.30913 154.305 9.51859 151.463 9.51859H125.602C122.421 9.51859 119.43 8.00545 117.546 5.44303L117.275 5.07556C115.391 2.51314 112.4 1 109.219 1H11C5.47716 1 1 5.47715 1 11V66.5511C1 69.0143 1.90906 71.3907 3.55294 73.225L7.47338 77.5996C9.11726 79.434 10.0263 81.8104 10.0263 84.2736V138.909C10.0263 141.372 9.11726 143.749 7.47339 145.583L5.2145 148.103C3.57062 149.938 2.66156 152.314 2.66156 154.777V210.329C2.66156 215.851 7.13872 220.329 12.6616 220.329H104.243C107.086 220.329 109.794 219.119 111.69 217.002L114.171 214.234C116.068 212.117 118.776 210.908 121.618 210.908H150.916C153.763 210.908 156.475 212.121 158.372 214.244L160.672 216.817C162.569 218.94 165.281 220.153 168.128 220.153H247.217C252.74 220.153 257.217 215.676 257.217 210.153V153.373C257.217 151.073 258.069 148.854 259.609 147.144V147.144C261.148 145.434 262 143.215 262 140.914V81.807C262 79.8581 261.431 77.9516 260.362 76.322L258.856 74.0266C257.787 72.397 257.217 70.4906 257.217 68.5417V11C257.217 5.47716 252.74 1 247.217 1H240.781Z"
              stroke="black"
              strokeMiterlimit={10}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Image clipped to the SVG path */}
      <MediaRenderer
        client={client}
        src={src}
        alt={alt}
        className={`${className} transition-transform duration-300 ease-in-out`}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "263px",
          height: "221px",
          objectFit: "cover",
          clipPath: "url(#clip-path)",
        }}
      />
    </div>
  );
}
