import "../utils/suppressConsoleErrors";
import "@/styles/globals.scss";

import { QueryProvider } from "@/modules/provider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "thirdweb/react";
import { Inter, Space_Grotesk } from "next/font/google";
import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { RootLayout } from "@/modules/app/layout";
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--space",
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <RootLayout>{page}</RootLayout>);

  return (
    <ThirdwebProvider>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --font-space: ${space.style.fontFamily};
            --font-space: ${space.style.fontFamily};
            }`,
        }}
      />
      <QueryProvider>
        <TooltipPrimitive.Provider delayDuration={500}>
          {getLayout(<Component {...pageProps} />)}
        </TooltipPrimitive.Provider>
      </QueryProvider>
    </ThirdwebProvider>
  );
}
