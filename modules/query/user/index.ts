import { useActiveAccount, useActiveWallet } from "thirdweb/react";

export function useUserChainInfo() {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();

  return { activeAccount, activeWallet };
}
