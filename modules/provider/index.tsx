import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useEffect, useState, useMemo } from "react";
import { useToast } from "../app/hooks/useToast";
import { useUserImageStore } from "@/utils/store/user-image.store";
import { useUserChainInfo } from "../query";
import { chainInfo } from "@/utils/configs";

type QueryProviderProps = {
  children: ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  const toast = useToast();
  const [isChainSupported, setIsChainSupported] = useState(false);

  const { activeAccount, activeWallet } = useUserChainInfo();
  const { setBackgroundImage, backgroundImage } = useUserImageStore();

  useEffect(() => {
    setBackgroundImage(backgroundImage);
  }, []);

  useEffect(() => {
    const checkChain = async () => {
      if (activeWallet) {
        const chain = await activeWallet.getChain();
        setIsChainSupported(chain?.id === chainInfo.id);
      } else {
        setIsChainSupported(false);
      }
    };

    checkChain();

    const unsubscribe = activeWallet?.subscribe("chainChanged", checkChain);

    return () => {
      unsubscribe?.();
    };
  }, [activeWallet]);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 0 } },
        mutationCache: new MutationCache({
          onMutate: (_variables, mutation) => {
            // if (!isChainSupported) {
            //   throw new Error("Please switch to the correct network");
            // }

            const showLoading = mutation?.meta?.showLoading;

            if (showLoading || showLoading === undefined) {
              toast.loading("Transaction In Process...", {
                id: mutation?.mutationId,
                duration: Infinity,
              });
            }
          },
          onSuccess: (_data, _variables, _context, mutation) => {
            // console.log('query provider success', _data, _variables, _context, mutation)

            const successMessage = mutation?.meta?.successMessage as {
              title?: string;
              description: string;
            };

            toast.dismiss(mutation?.mutationId);

            toast.success(
              successMessage
                ? successMessage.description
                : "Transaction was Successful",
              {
                id: `${mutation?.mutationId}-success`,
                duration: 5000,
              }
            );
          },
          onError: (error, _variables, _context, mutation) => {
            console.log("query provider error: ", error);

            const errorMessage = mutation?.meta?.errorMessage as {
              title?: string;
              description: string;
            };

            toast.dismiss(mutation?.mutationId);

            toast.error(
              errorMessage
                ? `${errorMessage.description} - ${error.message}`
                : error.message,
              {
                id: `${mutation?.mutationId}-error`,
                duration: 5000,
              }
            );
          },
        }),
      }),
    [isChainSupported, activeWallet, activeAccount]
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
