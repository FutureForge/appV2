import React, { useState } from "react";
import Image from "next/image";
import { getFormatAddress } from "@/utils/functions";
import { chainInfo } from "@/utils/configs";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/utils/configs";
import { Checkbox, EmptyState, NftCardSkeleton } from "@/modules/app";

// Icons
import CopyIcon from "@/assets/copy.svg";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { UserNFTData } from "@/utils/types/collection/collection.type";
import { useRouter } from "next/router";
import { ImageHolder } from "../home/components/collections-nft-card/collections-nft-card";

// Basic reusable components
export const ConnectWalletPrompt = () => (
  <div className="w-full h-[80vh] flex flex-col items-center justify-center gap-4">
    <p>Please connect wallet to continue</p>
    <ConnectButton
      client={client}
      chain={chainInfo}
      wallets={[createWallet("io.metamask")]}
      connectButton={{
        label: "Connect Wallet",
        className:
          "!font-space !rounded-lg !p-2 max-sm:!w-full !w-fit !text-sm !min-w-0 !flex !items-center !max-w-[28] !justify-center hover:!bg-primary/85 !duration-300 !ease-in-out !transition !bg-primary !text-white !h-[34px]",
      }}
    />
  </div>
);

export const ProfileHeader = ({ userAddress }: { userAddress?: string }) => {
  const copyToClipboard = useCopyToClipboard()[1];
  const handleCopy = (content: string) => {
    if (content) {
      copyToClipboard(content);
    }
  };

  return (
    <div className="h-[395px] relative w-full px-[35px] py-10 flex items-end">
      <Image
        src={"/profile-bg.png"}
        alt={"profile background image"}
        layout="fill"
        quality={100}
        priority
        className="w-full h-full object-cover rounded-3xl"
      />
      <div className="bg-gradient-to-tr from-background via-background/95 to-transparent absolute inset-0 z-10" />
      <div className="z-40 flex items-end justify-between w-full">
        <div className="z-30 flex flex-col gap-6 w-[40%]">
          <div className="flex flex-col gap-4 z-40">
            <div className="size-[123px] rounded-[22px] z-40" />
            {userAddress && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <h4 className="text-2xl max-md:text-lg font-medium flex gap-2 items-center">
                  {getFormatAddress(userAddress || "")}
                </h4>
                <CopyIcon
                  onClick={() => handleCopy(userAddress)}
                  className="size-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-300 ease-in-out"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExpiredOptionsFilter = ({
  selectedOption,
  setSelectedOption,
}: {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}) => {
  const options = ["Expired Listing", "Expired Auction", "Expired Offer"];

  return (
    <div className="flex items-center flex-wrap gap-4 whitespace-nowrap text-sm">
      {options.map((option) => (
        <div
          key={option}
          className="flex items-center gap-2"
          onClick={() => setSelectedOption(option)}
        >
          <Checkbox
            checked={selectedOption === option}
            onCheckedChange={() => setSelectedOption(option)}
          />
          <label
            className={
              selectedOption === option
                ? "text-primary"
                : "text-muted-foreground"
            }
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export const LoadMoreTrigger = ({
  ref,
}: {
  ref: React.Ref<HTMLDivElement>;
}) => (
  <div
    ref={ref}
    className="w-full h-20 col-span-full"
    style={{ gridColumn: "1 / -1" }}
  />
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="col-span-full w-full flex items-center justify-center min-h-[400px]">
    <EmptyState message={message} />
  </div>
);

export const LoadingSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="grid min-[1250px]:grid-cols-4 gap-y-5 w-full md:grid-cols-2 lg:grid-cols-3 grid-cols-1">
    {Array.from({ length: count }, (_, index) => (
      <NftCardSkeleton key={index} />
    ))}
  </div>
);

export function ProfileCustomNFTCard({ data }: { data: UserNFTData }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { metadata, tokenId, owner } = data?.nft || {};
  const { name, image } = metadata || {};
  const cta = "View Item";

  const handleViewItemClick = ({
    contractAddress,
    tokenId,
  }: {
    contractAddress: string;
    tokenId: string;
  }) => {
    router.push(`/nft/${contractAddress}/${tokenId}`);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-card w-[293px] border group cursor-pointer border-border rounded-2xl  flex flex-col gap-6 p-4 backdrop-blur-2xl"
    >
      {name ||
        (tokenId && (
          <p className="font-medium text-white">
            {name} - {tokenId}
          </p>
        ))}

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

      {owner && (
        <div className="flex items-center w-full justify-between">
          <div>
            <div className="flex items-center gap-1">
              <p className="text-lg font-medium text-white">Owner</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {owner ? getFormatAddress(owner) : ""}
            </p>
          </div>
          {/* <div>
            <p className="text-lg font-medium text-white">{"info2"}</p>
            <p className="text-sm text-muted-foreground">{"title2"}</p>
            </div> */}
        </div>
      )}

      {cta && (
        <motion.div className="w-full flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.button
            onClick={() =>
              handleViewItemClick({
                contractAddress: data.contractAddress,
                tokenId: data.tokenId,
              })
            }
            initial={{ y: "-100%", opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 40,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="bg-primary text-white w-fit rounded-lg py-2 px-3 text-sm font-medium"
          >
            {cta}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
