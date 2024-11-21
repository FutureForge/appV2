import { BrowsePage } from "@/modules/components/browse";
import Head from "next/head";
import React from "react";

export default function Browse() {
  return (
    <div className="mt-20 w-full min-h-screen px-4">
      <Head>
        <title>
          MintMingles Marketplace - Browse All Listings and Auctions
        </title>
        <meta
          name="description"
          content={`Browse all listings and auctions on Mint Mingle Marketplace`}
        />
      </Head>
      <BrowsePage />
    </div>
  );
}
