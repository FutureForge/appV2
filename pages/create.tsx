import { CreatePage } from "@/modules/components/create";
import Head from "next/head";

export default function Create() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)] mt-20 gap-7">
      <Head>
        <title>MintMingles Marketplace - Create NFT</title>
        <meta
          name="description"
          content={`Create NFT on Mint Mingle Marketplace`}
        />
      </Head>
      <CreatePage />
    </div>
  );
}
