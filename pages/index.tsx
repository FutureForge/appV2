import { Hero, Sliders } from "@/modules/components/home";
import Head from "next/head";

export default function Home() {
  return (
    <div className="h-full w-full pb-20">
      <Head>
        <title>MintMingles Marketplace - Cross-Fi NFT Marketplace</title>
        <meta name="description" content={`Cross-Fi NFT Marketplace`} />
      </Head>
      <Hero />
      <Sliders />
    </div>
  );
}
