import { createThirdwebClient, defineChain } from "thirdweb";
import { bscTestnet } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const chainInfo = bscTestnet;

export const MARKETPLACE_ADDRESS = "0x7Ed11a18630a9E569882Ca2F4D3488A88eF45d28";

export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD'
