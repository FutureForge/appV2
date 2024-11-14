import Image from "next/image";
import React, { useState } from "react";
import { getFormatAddress } from "@/utils/functions";
import { useActiveAccount } from "thirdweb/react";
// Icons
import VerifyIcon from "@/assets/verified.svg";
import CopyIcon from "@/assets/copy.svg";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Header } from "@/modules/app";

const filters = [
  "NFTS",
  "Listed",
  "Offers Made",
  "Auctions",
  "Offers Received",
  "NFT Activities",
  "Expired",
];

export default function Profile() {
  const activeAccount = useActiveAccount();
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const copyToClipboard = useCopyToClipboard()[1];
  const handleCopy = (content: string) => {
    if (content) {
      copyToClipboard(content);
    }
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
  };
  return (
    <div className="mt-20 w-full min-h-screen px-6">
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
              <Image
                src={"/image-2.png"}
                alt={"profile image"}
                width={123}
                height={123}
                className="size-[123px] rounded-[22px] z-40"
              />
              <div className="z-40 flex flex-col gap-3">
                <h4 className="text-2xl font-medium flex gap-2 items-center">
                  Collection Name
                  <VerifyIcon />
                </h4>
                {activeAccount && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getFormatAddress(activeAccount?.address || "")}
                    <CopyIcon
                      onClick={() => handleCopy(activeAccount?.address)}
                      className="size-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-300 ease-in-out"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 flex flex-col gap-8 h-screen">
        <Header
          isActive={isActive}
          setIsActive={setIsActive}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          onFilterClick={handleFilterClick}
          filters={filters}
          showRightSide
        />

        <div className="flex flex-wrap items-center gap-6">
          {/* render data here */}
        </div>
      </div>
    </div>
  );
}
