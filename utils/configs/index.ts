import { createThirdwebClient, defineChain } from "thirdweb";

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
}

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set");
}

export const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// export const backendURL = "http://localhost:7090/api/v1";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const MARKETPLACE_ADDRESS_TESTNET =
  "0xf0423D62bA0F73C31a95bEb1Dfc48A033469a0D9";

export const WRAPPED_TOKEN_CONTRACT =
  "0x10e6414ddea2e2be27e23584c651bc0a49e11e07";

export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

// export const NFT_FACTORY_ADDRESS = "0x1592e9383E7a268ab32c133c41Ee797f07323140";

// export const NFT_BASE_ADDRESS = "0x56532a3Df2a4F3c420Ec327C9a0667be36121DC3";

export const NFT_FACTORY_ADDRESS = "0x437734553aF3A2d0C6a3612f81749b468ccE4FEB";

export const NFT_BASE_ADDRESS = "0x91c0468eBB6D18f85AD0D21f64b5013BcCBFEd92";

export const nativeCurrency = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const CROSSFI_API_TESTNET = "https://test.xfiscan.com/api/1.0";

export const testnetProviderUrl = "https://rpc.xfi.ms/archive/4157";

export const crossFiTestnet = defineChain({
  id: 4157,
  rpc: testnetProviderUrl,
  nativeCurrency: {
    decimals: 18,
    name: "XFI",
    symbol: "XFI",
  },
  testnet: true,
  blockExplorers: [
    { name: "Testnet Explorer", url: "https://test.xfiscan.com/" },
  ],
});

export const mainnetProviderUrlMap = ["https://rpc.mainnet.ms/"];

export const crossFiMainnet = defineChain({
  id: 4158,
  name: "CrossFi Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "XFI",
    symbol: "XFI",
  },
  rpcUrls: {
    default: {
      // http: ['https://rpc.mainnet.ms/'],
      http: mainnetProviderUrlMap,
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://xfiscan.com/" },
  },
  // blockExplorers: [{ name: "Explorer", url: "https://xfiscan.com/" }],
});

export const chainInfo =
  process.env.NODE_ENV === "development" ? crossFiTestnet : crossFiMainnet;

export const providerUrl =
  process.env.NODE_ENV === "development"
    ? testnetProviderUrl
    : mainnetProviderUrlMap;
