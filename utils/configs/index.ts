import { createThirdwebClient, defineChain } from "thirdweb";

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
}

if (!process.env.NEXT_PUBLIC_IS_TESTNET) {
  throw new Error("NEXT_PUBLIC_IS_TESTNET is not set");
}

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  throw new Error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set");
}

export const IS_TESTNET = process.env.NEXT_PUBLIC_IS_TESTNET === "true";

export const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const MARKETPLACE_ADDRESS_TESTNET =
  "0xfc990527E5088B43bA1d3a30a7F9BDefd5667FfF";

export const MARKETPLACE_ADDRESS_MAINNET =
  "0xfc990527E5088B43bA1d3a30a7F9BDefd5667FfF";

export const USDT_TOKEN_CONTRACT_TESTNET =
  "0x75edC9335175Fc0552D51D48439F229c10420fe3";

// TODO: update with the real mainnet USDT address once deployed
export const USDT_TOKEN_CONTRACT_MAINNET =
  "0x75edC9335175Fc0552D51D48439F229c10420fe3";

export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

// TODO: update with the real BOT Chain NFT factory addresses
export const NFT_FACTORY_ADDRESS_TESTNET =
  "0x437734553aF3A2d0C6a3612f81749b468ccE4FEB";

export const NFT_FACTORY_ADDRESS_MAINNET =
  "0x3044aA7C191CD0D3d452eeb31B3624986156416b";

export const nativeCurrency = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

// TODO: provide the BOT Chain explorer API endpoint (was CrossFi xfiscan)
export const EXPLORER_API_URL = "";

export const testnetProviderUrlMap = ["https://rpc.bohr.life"];

export const mainnetProviderUrlMap = ["https://rpc.botchain.ai"];

export const bohrTestnet = defineChain({
  id: 968,
  name: "Bohr Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bohr.life"],
    },
  },
  testnet: true,
  blockExplorers: [
    { name: "Bohr Explorer", url: "https://scan.bohr.life/" },
  ],
});

export const botchainMainnet = defineChain({
  id: 677,
  name: "Botchain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.botchain.ai"],
    },
  },
  blockExplorers: [
    { name: "Botchain Explorer", url: "https://scan.botchain.ai/" },
  ],
});

export const chainInfo = IS_TESTNET ? bohrTestnet : botchainMainnet;

export const MARKETPLACE_ADDRESS = IS_TESTNET
  ? MARKETPLACE_ADDRESS_TESTNET
  : MARKETPLACE_ADDRESS_MAINNET;

export const NFT_FACTORY_ADDRESS = IS_TESTNET
  ? NFT_FACTORY_ADDRESS_TESTNET
  : NFT_FACTORY_ADDRESS_MAINNET;

export const USDT_TOKEN_CONTRACT = IS_TESTNET
  ? USDT_TOKEN_CONTRACT_TESTNET
  : USDT_TOKEN_CONTRACT_MAINNET;
