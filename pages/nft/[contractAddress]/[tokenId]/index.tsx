import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";

import { Details, TraitsOffers } from "@/modules/components/single-NFT";
import { useSingleNFTQuery } from "@/modules/query";

export default function SingleNFTPage() {
  const router = useRouter();
  const { assetContract, tokenId } = router.query;
  const { data: nftData } = useSingleNFTQuery({
    contractAddress: assetContract as string,
    tokenId: tokenId as string,
  });

  console.log("====================================");
  console.log({ nftData }, "log");
  console.log("====================================");
  return (
    <div className="mt-20 w-full min-h-screen px-6 max-w-[1355px] mx-auto flex flex-col gap-12">
      <Head>
        <title>MintMingles Marketplace - Single NFT</title>
        <meta
          name="description"
          content={`Single NFT on Mint Mingle Marketplace`}
        />
      </Head>
      <Details />
      <TraitsOffers />
    </div>
  );
}
