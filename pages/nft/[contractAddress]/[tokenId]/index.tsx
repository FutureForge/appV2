import Head from "next/head";
import { useRouter } from "next/router";
import {
  //  Details,
  TraitsOffers,
  RefactoredDetails,
} from "@/modules/components/single-NFT";

export default function SingleNFTPage() {
  const router = useRouter();
  const { contractAddress, tokenId } = router.query;

  return (
    <div className="mt-20 w-full min-h-screen px-6 max-w-[1355px] mx-auto flex flex-col gap-12 pb-40">
      <Head>
        <title>MintMingles Marketplace - Single NFT</title>
        <meta
          name="description"
          content={`Single NFT on Mint Mingle Marketplace`}
        />
      </Head>
      <RefactoredDetails
        contractAddress={contractAddress as string}
        tokenId={tokenId as string}
      />
      <TraitsOffers
        contractAddress={contractAddress as string}
        tokenId={tokenId as string}
      />
    </div>
  );
}
