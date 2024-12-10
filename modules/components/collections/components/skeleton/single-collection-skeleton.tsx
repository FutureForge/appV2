import { NftCardSkeleton } from "@/modules/app";
import React from "react";

export default function SingleCollectionSkeleton() {
  return (
    <div className="mt-20 w-full min-h-screen px-6">
      <div className="h-[395px] relative w-full px-[35px] max-sm:px-4 py-10 flex items-end">
        <div className="!w-full skeleton-el h-full absolute inset-0" />
        <div className="bg-gradient-to-tr from-background via-background/95 to-transparent absolute inset-0 z-10" />
        <div className="z-40 flex items-end justify-between w-full max-sm:flex-col max-sm:items-start">
          <div className="z-30 flex flex-col gap-6 w-[40%] max-sm:w-full">
            <div className="flex flex-col gap-4 z-40">
              <div className="size-[123px] !rounded-[22px] skeleton-el z-40" />

              <div className="z-40 flex flex-col gap-3">
                <h4 className="text-2xl font-medium skeleton-el flex gap-2 items-center h-7" />

                <div className="flex items-center gap-2 max-sm:w-full">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="!size-7 skeleton-el" />
                  ))}
                </div>
              </div>
            </div>
            <div className="z-40">
              <div className="h-20 skeleton-el !w-[300px] max-sm:!w-full" />
            </div>
          </div>
          <div className="z-40 flex items-center justify-between flex-1 max-[1007px]:hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="!w-[90px] h-[45px] skeleton-el" />
            ))}
          </div>
        </div>
      </div>

      {/* filter */}
      <div className="mt-7">
        <div className="grid grid-cols-2 gap-4 w-full sm:flex items-center justify-between mt-3 min-[1007px]:hidden mb-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="!w-[90px] h-[45px] skeleton-el" />
          ))}
        </div>
        <div className="w-full flex justify-between items-center max-sm:flex-col gap-4">
          <div className="h-10 skeleton-el !w-[400px] max-sm:!w-full" />

          <div className="flex items-center gap-2 max-sm:w-full">
            <div className="h-10 skeleton-el !w-[400px] max-sm:!w-full" />
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
        <div className="grid min-[1210px]:grid-cols-4 min-[1007px]:grid-cols-3 max-[1007px]:flex flex-wrap gap-4 items-center justify-center grid-cols-1 max-sm w-full z-40 gap-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <NftCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
