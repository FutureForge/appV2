import React from "react";
import { OffersTable } from "../tables/offers-table";
import { Card } from "@/modules/app";

export function TraitsSkeleton() {
  return (
    <div className="flex w-full items-start justify-between gap-10">
      <div className="w-1/2 flex flex-col gap-4">
        <div className="border border-border rounded-2xl p-4 flex flex-col gap-4">
          <div className="h-10 skeleton-el !w-24" />
          <div className="flex  items-center w-full justify-between">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="h-10 skeleton-el !w-24" key={index} />
            ))}
          </div>
        </div>

        <div className="h-14 skeleton-el !w-full" />
      </div>

      <div className="w-1/2 p-4 flex flex-col gap-4 rounded-2xl border border-border">
        <div className="h-10 skeleton-el !w-24" />
        <Card className="w-full flex flex-col gap-4 h-80 !p-4 bg-card rounded-2xl">
          <div className="h-10 skeleton-el !w-full border-b border-b-border" />

          <div className="flex flex-col gap-6 w-full">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="h-10 skeleton-el !w-full" key={index} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
