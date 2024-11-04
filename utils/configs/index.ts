import { createThirdwebClient, defineChain } from "thirdweb";

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
}

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set");
}

export const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const MARKETPLACE_ADDRESS_TESTNET =
  "0x8cDecE143Bd214D0c4f645602c5fFCB5EFb042f9";

export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

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
});

export const chainInfo =
  process.env.NODE_ENV === "development" ? crossFiTestnet : crossFiMainnet;

export const providerUrl =
  process.env.NODE_ENV === "development"
    ? testnetProviderUrl
    : mainnetProviderUrlMap;
