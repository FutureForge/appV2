"use client";
import React, { ReactNode } from "react";
import Slider, { Settings } from "react-slick";
import ArrowRight from "@/assets/icons/icons-arrow-right.svg";
// import { CountdownTimer } from "@/modules/components/Home/components/functions/calculate-time";
// import { Title } from "../title/title";

import { cn } from "../../utils";
import { TransitionLinks } from "../nav/transition-links";
import { NftCardSkeleton } from "../nft-card-skeleton/nft-card-skeleton";
// import { ProductCardSkeleton } from "../product-card";

type SliderProps = {
  children: ReactNode;
  title: string;
  cta?: string;
  flash?: boolean;
  isLoading?: boolean;
  settings?: Settings;
  className?: string;
  href?: string;
};

export function CustomSlider({
  children,
  title,
  href = "",
  cta,
  isLoading = false,
  settings = {},
  className,
}: SliderProps) {
  const defaultSettings: Settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 739,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 487,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 0.8,
        },
      },
    ],
  };

  const sliderSettings = { ...defaultSettings, ...settings };
  return (
    <div className={cn("text-black mt-12 flex flex-col gap-8", className)}>
      <div className="flex items-center w-full justify-between">
        <h3 className="font-medium md:text-2xl text-base  text-white">{title}</h3>
        <TransitionLinks
          href={href}
          className="text-white bg-border rounded-xl px-3 py-2 hover:bg-border/70 transition-all duration-300 ease-in-out"
        >
          {cta}
        </TransitionLinks>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-4 w-full">
          {Array.from({ length: 4 }, (_, index) => (
            <NftCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <Slider {...sliderSettings}>{children}</Slider>
      )}
    </div>
  );
}

