import { createThirdwebClient, defineChain } from "thirdweb";

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
}

if (!process.env.NEXT_PUBLIC_IS_TESTNET) {
  throw new Error("NEXT_PUBLIC_IS_TESTNET is not set");
}

export const IS_TESTNET = process.env.NEXT_PUBLIC_IS_TESTNET === "true";

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

export const MARKETPLACE_ADDRESS_MAINNET =
  "0xeE51A7e4bE561C63f4F03787d1c8B8dE0c826717";

export const WRAPPED_TOKEN_CONTRACT_TESTNET =
  "0x10e6414ddea2e2be27e23584c651bc0a49e11e07";

export const WRAPPED_TOKEN_CONTRACT_MAINNET = "";

export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

export const NFT_FACTORY_ADDRESS_TESTNET =
  "0x437734553aF3A2d0C6a3612f81749b468ccE4FEB";

export const NFT_FACTORY_ADDRESS_MAINNET =
  "0x3044aA7C191CD0D3d452eeb31B3624986156416b";

export const nativeCurrency = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const CROSSFI_API_TESTNET = "https://test.xfiscan.com/api/1.0";

export const CROSSFI_API_MAINNET = "https://api.xfiscan.com/api/1.0";

export const testnetProviderUrl = "https://rpc.xfi.ms/archive/4157";

export const testnetProviderUrlMap = [
  // "https://crossfi-testnet.g.alchemy.com/v2/LyMEMlI9ehqzPfajiDhvBXZ4MGjUQ6L-",
  'https://4157.rpc.thirdweb.com',
  "https://rpc.testnet.ms/",
  "https://rpc.xfi.ms/archive/4157",
];

export const mainnetProviderUrlMap = [
  // "https://crossfi-mainnet.g.alchemy.com/v2/LyMEMlI9ehqzPfajiDhvBXZ4MGjUQ6L-",
  "https://rpc.mainnet.ms/",
  'https://4158.rpc.thirdweb.com',
];

export const crossFiTestnet = defineChain({
  id: 4157,
  name: "CrossFi Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "XFI",
    symbol: "XFI",
  },
  rpcUrls: {
    default: {
      http: testnetProviderUrlMap,
    },
  },
  testnet: true,
  blockExplorers: [
    { name: "Testnet Explorer", url: "https://test.xfiscan.com/" },
  ],
});

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
      http: mainnetProviderUrlMap,
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://xfiscan.com/" },
  },
});

export const chainInfo = IS_TESTNET ? crossFiTestnet : crossFiMainnet;

export const MARKETPLACE_ADDRESS = IS_TESTNET
  ? MARKETPLACE_ADDRESS_TESTNET
  : MARKETPLACE_ADDRESS_MAINNET;

export const NFT_FACTORY_ADDRESS = IS_TESTNET
  ? NFT_FACTORY_ADDRESS_TESTNET
  : NFT_FACTORY_ADDRESS_MAINNET;

export const providerUrl = IS_TESTNET
  ? testnetProviderUrl
  : mainnetProviderUrlMap;

export const CROSSFI_API_URL = IS_TESTNET
  ? CROSSFI_API_TESTNET
  : CROSSFI_API_MAINNET;

export const WRAPPED_TOKEN_CONTRACT = IS_TESTNET
  ? WRAPPED_TOKEN_CONTRACT_TESTNET
  : WRAPPED_TOKEN_CONTRACT_MAINNET;
