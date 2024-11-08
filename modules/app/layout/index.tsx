import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Nav } from "../component/nav";
import { Footer } from "../component/footer/footer";

type RootLayoutProps = {
  children: ReactNode;
  scrollToTop?: boolean;
};

const Toast = dynamic(() => import("@/modules/components/toast/toast"), {
  ssr: false,
});
export const RootLayout = ({ children, scrollToTop }: RootLayoutProps) => {
  return (
    <div className="flex isolate flex-col min-h-screen font-space relative bg-background">
      {/* max-w-[1440px] mx-auto */}
      <Nav />
      <div
        className="flex-grow w-full min-h-screen pb-16"
        ref={(node) => {
          if (node && scrollToTop) {
            node.scroll(0, 0);
          }
        }}
      >
        {children}
        <Toast />
      </div>
      <Footer />
    </div>
  );
};
