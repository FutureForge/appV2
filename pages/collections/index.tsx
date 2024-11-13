"use client";
import { CollectionPage } from "@/modules/components/collections";
import { HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export default function Collection() {
  return (
    <HydrationBoundary>
      <div suppressHydrationWarning className="mt-20 w-full min-h-screen px-6">
        <CollectionPage />
      </div>
    </HydrationBoundary>
  );
}
