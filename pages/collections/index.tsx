"use client";
import { CollectionPage } from "@/modules/components/collections";
import { HydrationBoundary } from "@tanstack/react-query";
import Head from "next/head";
import React from "react";

export default function Collection() {
  return (
    <HydrationBoundary>
      <div suppressHydrationWarning className="mt-20 w-full min-h-screen px-6">
        <Head>
          <title>MintMingles Marketplace - Browse All Collections</title>
          <meta
            name="description"
            content={`Browse all collections on Mint Mingle Marketplace`}
          />
        </Head>
        <CollectionPage />
      </div>
    </HydrationBoundary>
  );
}
