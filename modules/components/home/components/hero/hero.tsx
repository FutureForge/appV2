import { cn } from "@/modules/app/utils";
import Image from "next/image";
import { useState } from "react";
import Slider, { Settings } from "react-slick";
import { useWindowSize } from "@uidotdev/usehooks";
import { usePromotedCollectionsQuery } from "@/modules/query";
import { CollectionsNFTCard } from "../collections-nft-card/collections-nft-card";
import { NftCardSkeleton } from "@/modules/app";
import { useRouter } from "next/navigation";
import { Collection } from "@/utils/types/collection/collection.type";

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { width } = useWindowSize();
  const router = useRouter();
  const length = (() => {
    if (width && width > 1720) {
      return 5;
    } else if (width && width <= 1720 && width > 1250) {
      return 4;
    } else if (width && width <= 1250 && width > 936) {
      return 3;
    } else if (width && width <= 936 && width > 650) {
      return 2;
    } else if (width && width <= 650) {
      return 1;
    }
    return 4;
  })();

  const {
    data: promotedCollections,
    isLoading,
    isError,
  } = usePromotedCollectionsQuery();

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    dotsClass: "flex items-center justify-center pt-2",
    appendDots: (dots) => (
      <div className="!static !flex !items-center !justify-center ">
        <ul className="slick-dots w-full !flex gap-12 flex-col absolute top-[15%] min-[1170px]:left-[92%] left-[80%]">
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={cn(
          "p-2 border-[3.43px] border-transparent transition-all duration-300 ease-in-out size-16 rounded-full flex items-center justify-center",
          {
            "scale-110 border-primary": i === currentSlide,
          }
        )}
      >
        <div className="flex w-full h-full relative rounded-full">
          <Image
            src={promotedCollections?.[i]?.promotionBackgroundImage!}
            alt={`Thumbnail ${i + 1}`}
            layout="fill"
            objectFit="cover"
            quality={100}
            className={cn(
              "rounded-full transition-transform border-[0.93px] border-background duration-300"
            )}
          />
        </div>
      </div>
    ),
    beforeChange: (current, next) => {
      setCurrentSlide(next);
    },
  };

  return (
    <div className="h-screen w-full relative overflow-x-hidden">
      {/* Banner */}
      {promotedCollections && promotedCollections.length > 1 ? (
        <Slider {...settings}>
          {promotedCollections.map((collection, index) => (
            <div
              key={index}
              className="relative h-[90vh] w-full overflow-hidden"
            >
              <Image
                src={collection.promotionBackgroundImage}
                alt="banner"
                layout="fill"
                objectFit="cover"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            </div>
          ))}
        </Slider>
      ) : (
        promotedCollections?.map((collection, index) => (
          <div key={index} className="relative h-[90vh] w-full overflow-hidden">
            <Image
              src={collection.promotionBackgroundImage}
              alt="banner"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </div>
        ))
      )}

      {/* collection cards */}
      <div className="absolute bottom-2 w-full h-fit flex items-center justify-center gap-5">
        {isLoading || isError ? (
          <>
            {Array.from({ length }).map((_, index) => (
              <NftCardSkeleton />
            ))}
          </>
        ) : (
          <>
            {promotedCollections &&
              promotedCollections.map((collection: Collection) => {
                const contractAddress = collection.collectionAddress;
                const handleClick = () => {
                  router.push(`/collections/${contractAddress}`);
                };
                return (
                  <CollectionsNFTCard
                    key={collection._id}
                    collectionAddress={collection.collectionAddress}
                    collectionImage={collection.collectionImage}
                    collectionName={collection.collectionName}
                    floorPrice={collection.floorPrice}
                    totalVolume={collection.totalVolume}
                    onClick={handleClick}
                    cta="Shop Collections"
                  />
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
