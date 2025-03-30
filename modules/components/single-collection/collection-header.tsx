// components/collections/CollectionPage/CollectionHeader.tsx
import Image from "next/image";
import Link from "next/link";
import { CollectionDetails } from ".";

import VerifyIcon from "@/assets/verified.svg";
import X from "@/assets/logo-x-twitter.svg";
import Telegram from "@/assets/telegram.svg";
import Discord from "@/assets/discord.svg";
import { Collection } from "@/utils/types/collection/collection.type";

interface CollectionHeaderProps {
  collection: Collection;
  details: any;
}

export const CollectionHeader = ({
  collection,
  details,
}: CollectionHeaderProps) => {
  const {
    collectionSocials,
    collectionBackgroundImage,
    collectionName,
    collectionImage,
    collectionDescription,
  } = collection || {};

  const updatedCollectionSocials = collectionSocials?.map((item) => ({
    icon:
      item.socialName === "twitter" ? (
        <X className="size-[14px]" />
      ) : item.socialName === "discord" ? (
        <Discord className="size-[14px]" />
      ) : (
        <Telegram className="size-[14px]" />
      ),
    link: item.socialLink,
  }));

  return (
    <div className="h-[395px] relative w-full px-[35px] max-sm:px-4 py-10 flex items-end">
      <Image
        src={collectionBackgroundImage || ""}
        alt={collectionName || ""}
        layout="fill"
        quality={100}
        priority
        className="w-full h-full object-cover rounded-3xl"
      />
      <div className="bg-gradient-to-tr from-background via-background/95 to-transparent absolute inset-0 z-10" />
      <div className="z-40 flex min-[870px]:items-end justify-between max-[970px]:flex-col gap-6 w-full">
        <div className="z-30 flex flex-col gap-6 w-[40%] max-[970px]:w-full items-start">
          <div className="flex flex-col gap-4 z-40">
            <Image
              src={collectionImage || ""}
              alt={collectionName || ""}
              width={123}
              height={123}
              className="size-[123px] rounded-[22px] z-40"
            />
            <div className="z-40 flex flex-col gap-3">
              <h4 className="text-2xl font-medium flex gap-2 items-center">
                {collectionName || "Collection Name"} <VerifyIcon />
              </h4>
              <div className="flex items-center gap-2">
                {updatedCollectionSocials?.map((item, index) => (
                  <Link
                    key={`collection-social-${index}`}
                    href={item.link}
                    className="bg-tertiary rounded-lg size-7 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-table-hover"
                  >
                    {item.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="z-40">
            <p>
              {collectionDescription ||
                "Lorem ipsum dolor sit amet consectetur. Orci proin elementum faucibus tincidunt id."}
            </p>
          </div>
        </div>
        <div className="z-40 flex items-center justify-between flex-1 max-[970px]:hidden">
          <CollectionDetails details={details} />
        </div>
      </div>
    </div>
  );
};
