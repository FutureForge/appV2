import React from "react";

export function DetailsSkeleton() {
  return (
    <div className="flex gap-6 w-full max-[1245px]:flex-col">
      <div className="w-[40%] max-[1245px]:w-full flex flex-col gap-6">
        <div className="w-full bg-tertiary p-4 rounded-xl flex items-center justify-between">
          <div className="skeleton-el h-10 w-12" />
          <div className="skeleton-el h-6 w-10" />
        </div>
        <div className="w-full relative h-[550px] max-sm:h-full z-40 rounded-2xl">
          <div className="!w-full h-[550px] max-sm:h-[350px] skeleton-el">
            {/* <div className="w-full h-[257px] absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-2xl via-black/80 from-background to-transparent" /> */}
            <div className="absolute bottom-4 px-8 w-full flex justify-between items-center">
              <div className="skeleton-el h-10 !w-48" />

              <div className="skeleton-el h-10 !w-48" />
            </div>
          </div>
        </div>
      </div>

      {/* details section */}
      <div className="flex-1 flex flex-col gap-6 h-fit">
        <div className="h-10 skeleton-el !w-full" />

        <div className="flex flex-col gap-6">
          <div className="h-14 skeleton-el !w-full" />

          <div className="bg-card rounded-xl p-4 flex max-sm:grid grid-cols-2 gap-4 items-center justify-between">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                className="h-10 skeleton-el !w-24 max-sm:!w-full"
                key={index}
              />
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r w-full from-border via-black/70 to-transparent p-3 rounded-2xl flex items-center max-sm:flex-col justify-between gap-6 border border-border">
          <div className="w-1/2 flex flex-col gap-6 p-3 max-sm:w-full">
            <div className="h-10 skeleton-el !w-28" />
            <div className="grid grid-cols-2 gap-5">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="h-10 skeleton-el !w-full" key={index} />
              ))}
            </div>
          </div>

          <div className="border border-border rounded-xl w-1/2 max-sm:w-full">
            <div className="border-b border-b-border p-3">
              <div className="h-8 skeleton-el !w-full" />
            </div>
            <div className="p-3 flex-col flex gap-3 mt-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="h-14 skeleton-el !w-full" key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="!w-full h-[42px]" />
        </div>
      </div>
    </div>
  );
}
