import CreateNFTContract from "@/modules/components/create/component/create-nft-contract";
import Head from "next/head";

export default function Create() {
  return (
    <div className="flex items-center min-[909px]:justify-center h-[calc(100vh-80px)] mt-20 gap-7 w-full">
      <Head>
        <title>MintMingles Marketplace - Create Contract</title>
        <meta
          name="description"
          content={`Create Contract on CrossFi via MintMingles Marketplace`}
        />
      </Head>
      <CreateNFTContract />
    </div>
  );
}
