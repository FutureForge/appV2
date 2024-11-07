import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { cn } from "../../utils";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useDisableScroll } from "../../hooks/useDisableScroll";
import { chainInfo, client } from "@/utils/configs";
import { usePathname } from "next/navigation";

// Icons
import Logo from "@/public/logo.svg";
import { TextField } from "../inputs/inputs";
import { TransitionLinks } from "./transition-links";


const Nav_Links = [
  {
    name: "Create",
    link: "/create",
  },
  {
    name: "Add Collections",
    link: "/add_collections",
  },
  {
    name: "Collections",
    link: "/collections",
  },
];

export function Nav() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useDisableScroll(isMobileNavOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        "flex absolute top-0 inset-x-0 z-50 py-3 h-[80px] border-b bg-[#030312E5] w-full md:px-6 px-4 gap-4 justify-between  items-center font-inter",
        isScrolled ? "border-b-sec-bg" : "border-b-transparent"
      )}
    >
      <div className="flex items-center justify-between w-[48%]">
        <Link
          href={"/"}
          className="text-white font-medium flex-1 flex gap-1 items-center"
        >
          <Logo />
          <span className="hidden sm:block">MintMingle</span>
        </Link>

        <ul className="min-[1170px]:flex hidden items-center justify-end gap-8 w-full">
          {Nav_Links.map((item) => {
            const { name, link } = item;
            const isActive = pathname === link;

            return (
              <li key={name} className="flex items-center justify-between">
                <TransitionLinks
                  href={link}
                  className={cn(
                    "text-muted-foreground font-medium whitespace-nowrap hover:text-foreground duration-300 ease-in-out transition",
                    { "text-foreground": isActive }
                  )}
                >
                  {name}
                </TransitionLinks>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center justify-between w-[48%]">
        <div className="w-1/2">
          <TextField
            type="search"
            placeholder="Search for collections, NFT or Users"
          />
        </div>

        <div className="flex items-center gap-8">
          <TransitionLinks href="/profile" className={cn("font-medium")}>
            Profile
          </TransitionLinks>
          <ConnectButton
            client={client}
            chain={chainInfo}
            wallets={[createWallet("io.metamask")]}
            connectButton={{
              label: "Connect Wallet",
              className:
                "!font-space !rounded-lg !p-2 max-sm:!w-full !w-fit !text-sm !min-w-0 !flex !items-center !max-w-[28] !justify-center hover:!bg-primary/85 !duration-300 !ease-in-out !transition !bg-primary !text-white !h-[34px]",
            }}
          />
        </div>
      </div>
      {/* <div className="min-[1170px]:hidden flex items-center gap-8">
        {isMobileNavOpen ? (
          <IoClose
            size={30}
            onClick={() => setIsMobileNavOpen(false)}
            className="text-muted-foreground"
          />
        ) : (
          <IoIosMenu
            size={30}
            className="text-muted-foreground"
            onClick={() => setIsMobileNavOpen(true)}
          />
        )}
      </div>
      {isMobileNavOpen && <MobileNav />} */}
    </nav>
  );
}

function MobileNav() {
  return (
    <div className="fixed top-[64px] left-0 w-full h-screen flex flex-col items-center bg-sec-bg text-primary-foreground z-50">
      <div className="flex flex-col items-center justify-center gap-5 mt-10">
        {Nav_Links.map((item) => {
          const { name, link } = item;

          return (
            <ul key={name} className="flex">
              <li className="flex">
                <Link
                  href={link}
                  className="hover:text-button-hover font-medium text-xl text-muted-foreground"
                >
                  {name}
                </Link>
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}
