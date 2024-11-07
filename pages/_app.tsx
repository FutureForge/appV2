import "../utils/suppressConsoleErrors";
import "@/styles/globals.css";

import { QueryProvider } from "@/modules/provider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "thirdweb/react";
import { Inter, Space_Grotesk } from "next/font/google";
import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { RootLayout } from "@/modules/app/layout";

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
            --font-inter: ${space.style.fontFamily};
            --font-inter: ${space.style.fontFamily};
            }`,
        }}
      />
      <QueryProvider>{getLayout(<Component {...pageProps} />)}</QueryProvider>
    </ThirdwebProvider>
  );
}
