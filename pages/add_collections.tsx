import { AddCollectionsPage } from "@/modules/components/add-collection";
import Head from "next/head";

export default function AddCollections() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)] mt-20 gap-7">
      <Head>
        <title>MintMingles Marketplace - Add Collection</title>
        <meta
          name="description"
          content={`Add collection to Mint Mingle Marketplace`}
        />
      </Head>
      <AddCollectionsPage />
    </div>
  );
}
