import { NftCardSkeleton } from "@/modules/app";
import React from "react";

export default function SingleCollectionSkeleton() {
  return (
    <div className="mt-20 w-full min-h-screen px-6">
      <div className="h-[395px] relative w-full px-[35px] py-10 flex items-end">
        <div className="!w-full skeleton-el h-full absolute inset-0" />
        <div className="bg-gradient-to-tr from-background via-background/95 to-transparent absolute inset-0 z-10" />
        <div className="z-40 flex items-end justify-between w-full">
          <div className="z-30 flex flex-col gap-6 w-[40%]">
            <div className="flex flex-col gap-4 z-40">
              <div className="size-[123px] !rounded-[22px] skeleton-el z-40" />

              <div className="z-40 flex flex-col gap-3">
                <h4 className="text-2xl font-medium skeleton-el flex gap-2 items-center h-7" />

                <div className="flex items-center gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="!size-7 skeleton-el" />
                  ))}
                </div>
              </div>
            </div>
            <div className="z-40">
              <div className="h-20 skeleton-el !w-[300px]" />
            </div>
          </div>
          <div className="z-40 flex items-center justify-between flex-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="!w-[90px] h-[45px] skeleton-el" />
            ))}
          </div>
        </div>
      </div>

      {/* filter */}
      <div className="mt-7">
        <div className="w-full flex justify-between items-center">
          <div className="h-10 skeleton-el !w-[400px]" />

          <div className="flex items-center gap-2">
            <div className="h-10 skeleton-el !w-[400px]" />
            <div className="z-40 flex items-center justify-between gap-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="!w-[40px] h-10 skeleton-el" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contents */}
      <div className="mt-6">
        <div className="z-40 flex items-center justify-between flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <NftCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
