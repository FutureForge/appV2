import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Nav } from "../component/nav";
import { Footer } from "../component/footer/footer";
import { usePathname } from "next/navigation";

type RootLayoutProps = {
  children: ReactNode;
  scrollToTop?: boolean;
};

const Toast = dynamic(() => import("@/modules/components/toast/toast"), {
  ssr: false,
});
export const RootLayout = ({ children, scrollToTop }: RootLayoutProps) => {
  const pathname = usePathname();
  return (
    <div className="flex isolate flex-col min-h-screen font-space relative overflow-y-auto bg-background">
      {/* max-w-[1440px] mx-auto */}
      <Nav />
      <div
        className="flex-grow w-full min-h-screen max-w-[1730px] mx-auto"
        ref={(node) => {
          if (node && scrollToTop) {
            node.scroll(0, 0);
          }
        }}
      >
        {children}
        <Toast />
      </div>
      {pathname !== "/create" && pathname !== "/add_collections" && <Footer />}
    </div>
  );
};
