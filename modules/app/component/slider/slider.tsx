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
    // nextArrow: <SampleNextArrow />,
    // prevArrow: <SamplePrevArrow />,
    cssEase: "linear",
  };

  const sliderSettings = { ...defaultSettings, ...settings };
  return (
    <div className={cn("text-black mt-12 flex flex-col gap-8", className)}>
      <div className="flex items-center w-full justify-between">
        <h3 className="font-medium text-2xl text-white">{title}</h3>
        <TransitionLinks
          href={href}
          className="text-white bg-border rounded-full px-3 py-2 hover:bg-border/70 transition-all duration-300 ease-in-out"
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

// type ArrowProps = {
//   className?: string;
//   style?: React.CSSProperties;
//   onClick?: () => void;
//   top?: string;
//   right?: string | number | undefined;
//   left?: string | number | undefined;
// };

// export function SampleNextArrow(props: ArrowProps) {
//   const { className, style, onClick, top = "-20%", right = "2%" } = props;
//   return (
//     <div
//       className={`${className} absolute top-0 right-12`}
//       style={{
//         ...style,
//         display: "flex",
//         background: "#f5f5f5",
//         width: "46px",
//         height: "46px",
//         borderRadius: "100%",
//         alignItems: "center",
//         justifyContent: "center",
//         position: "absolute",
//         top: top,
//         right: right,
//       }}
//       onClick={onClick}
//     >
//       <ArrowRight className="size-6 text-black" />
//     </div>
//   );
// }

// export function SamplePrevArrow(props: ArrowProps) {
//   const { className, style, onClick, top = "-20%", left = "90%" } = props;
//   return (
//     <div
//       className={className}
//       style={{
//         ...style,
//         display: "flex",
//         background: "#f5f5f5",
//         width: "46px",
//         height: "46px",
//         borderRadius: "100%",
//         alignItems: "center",
//         justifyContent: "center",
//         position: "absolute",
//         top: top,
//         left: left,
//       }}
//       onClick={onClick}
//     >
//       <ArrowRight className="size-6 text-black rotate-180" />
//     </div>
//   );
// }
