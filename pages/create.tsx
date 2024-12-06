import { CreatePage } from "@/modules/components/create";
import Head from "next/head";
import React from "react";

export default function Create() {
  return (
    <div className="flex items-center min-[909px]:justify-center h-[calc(100vh-80px)] mt-20 gap-7 w-full">
      <Head>
        <title>MintMingles Marketplace - Create NFT</title>
        <meta
          name="description"
          content={`Create NFT on CrossFi via MintMingles Marketplace`}
        />
      </Head>
      <CreatePage />
    </div>
  );
}
