import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "../../utils";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useDisableScroll } from "../../hooks/useDisableScroll";
import { chainInfo, client } from "@/utils/configs";
import { usePathname } from "next/navigation";
import { TransitionLinks } from "./transition-links";
import { useUserChainInfo } from "@/modules/query";
import { getFormatAddress } from "@/utils/functions";
import { Popover } from "../popover";
import { Button } from "../button";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Search } from "../search";
import { useApprovalSettingStore } from "@/utils/store/approval-settings.store";
import { useUserImageStore } from "@/utils/store/user-image.store";

// Icons
import Logo from "@/assets/M.svg";
import Mingles from "@/assets/MINGLE WM.svg";
import Info from "@/assets/info.svg";
import CopyIcon from "@/assets/copy.svg";
import CheckIcon from "@/assets/check-2.svg";
import LogoutIcon from "@/assets/logout-box-r-line.svg";
import MenuIcon from "@/assets/menu-04.svg";
import CloseIcon from "@/assets/close.svg";
import { useToast } from "../../hooks/useToast";

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
  {
    name: "Browse",
    link: "/browse",
  },
];

export function Nav() {
  const { activeAccount, activeWallet } = useUserChainInfo();
  const walletAddress = activeAccount?.address;
  const [isChainSupported, setIsChainSupported] = useState(false);
  const toast = useToast();

  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  const { approvalSetting, setApprovalSetting } = useApprovalSettingStore();
  const { backgroundImage } = useUserImageStore();

  const copyToClipboard = useCopyToClipboard()[1];

  const copy = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (copied) return;
    if (walletAddress) {
      copyToClipboard(walletAddress);
      setCopied(true);
      toast.success("Wallet address copied successfully");
      setTimeout(() => setCopied(false), 3000);
    }
  };

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

  const handleSignOut = async () => {
    await activeWallet?.disconnect();
  };

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

    // Optional: Listen for chain changes if your wallet provider supports it
    const unsubscribe = activeWallet?.subscribe("chainChanged", checkChain);

    return () => {
      unsubscribe?.();
    };
  }, [activeWallet]);

  return (
    <nav
      className={cn(
        "flex fixed top-0 inset-x-0 z-50 py-3 h-[80px] border-b bg-[#030312E5] w-full md:px-6 px-4 gap-4 justify-between  items-center font-inter",
        isScrolled ? "border-b-border backdrop-blur-lg" : "border-b-transparent"
      )}
    >
      <div className="flex items-center min-[1170px]:justify-between gap-6 w-[48%]">
        <Link
          href={"/"}
          className="text-white font-medium flex-1 flex gap-1 items-center"
        >
          <Logo className="w-8" />
          <span className="hidden sm:block">
            <Mingles className="w-24" />
          </span>
        </Link>

        <ul className="flex  items-center max-[936px]:hidden justify-end min-[1170px]:gap-8 gap-6 w-full">
          {/* hidden min-[1170px]:*/}
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
      <div className="flex items-center min-[1170px]:justify-between justify-end gap-4 w-[48%]">
        <div className="min-[1170px]:w-1/2 justify-end">
          <Search />
        </div>

        <div className="flex items-center gap-8 max-sm:gap-2">
          <TransitionLinks
            href="/profile"
            className={cn(
              "font-medium text-muted-foreground max-[936px]:hidden hover:text-foreground transition-colors duration-300 ease-in-out",
              { "text-foreground": pathname === "/profile" }
            )}
          >
            Profile
          </TransitionLinks>
          {!walletAddress || !isChainSupported ? (
            <ConnectButton
              client={client}
              chain={chainInfo}
              wallets={[createWallet("io.metamask")]}
              connectButton={{
                label: "Connect Wallet",
                className:
                  "!font-space !rounded-lg !p-2 max-sm:!w-full !whitespace-nowrap !w-fit !text-sm !min-w-0 !flex !items-center !max-w-[28] !justify-center hover:!bg-primary/85 !duration-300 !ease-in-out !transition !bg-primary !text-white !h-[34px]",
              }}
            />
          ) : (
            <div className="relative group">
              <Popover.Root>
                <Popover.Trigger>
                  <Button
                    shape="square"
                    variant="secondary"
                    className="group bg-transparent max-[599px]:!h-[38px] max-[599px]:!w-[38px] !h-10 hover:border-primary data-[state=open]:z-20"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-full relative">
                        <div
                          className="h-full w-full rounded-full border border-border"
                          style={{
                            backgroundImage: backgroundImage,
                          }}
                        />
                      </div>
                      <p
                        className={cn(
                          "font-sans !text-sm group-hover:!text-new-accent transition-all duration-300 ease-in-out text-white max-md:hidden"
                          // {
                          //   "hidden transition-all duration-300 ease-in-out":
                          //     isTab && isOpen,
                          // }
                        )}
                      >
                        {getFormatAddress(walletAddress)}
                      </p>
                    </div>
                  </Button>
                </Popover.Trigger>
                <Popover.Content
                  align="end"
                  sideOffset={5}
                  className="w-[240px] p-3"
                >
                  <div className="flex flex-col gap-3 w-full ">
                    <span className="flex items-center text-sm gap-2 text-white font-medium">
                      Approval Type
                      <Info className="size-4 text-muted-foreground" />
                    </span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant={
                          approvalSetting === "unlimited"
                            ? "primary"
                            : "secondary"
                        }
                        onClick={() => setApprovalSetting("unlimited")}
                        shape="square"
                        className={cn(
                          "h-[31px] !text-xs !flex-1 uppercase bg-transparent !duration-150 font-space"
                        )}
                      >
                        Unlimited
                      </Button>
                      <Button
                        variant={
                          approvalSetting === "1/1" ? "primary" : "secondary"
                        }
                        onClick={() => setApprovalSetting("1/1")}
                        shape="square"
                        className={cn(
                          "h-[31px] !text-xs !flex-1 uppercase !duration-150 font-space"
                        )}
                      >
                        1/1
                      </Button>
                    </div>
                  </div>
                  {/* Copy */}
                  <div className="w-full mt-3">
                    <div
                      onClick={copy}
                      className="cursor-pointer hover:border-border h-9 hover:bg-tertiary transition-colors duration-500 ease-in-out px-2.5 border border-transparent rounded-lg text-white flex items-center gap-2"
                    >
                      <div>
                        {copied ? (
                          <CheckIcon className="size-4 text-muted-foreground" />
                        ) : (
                          <CopyIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>

                      <span className="text-sm">Copy Wallet Address</span>
                    </div>
                  </div>

                  <div className="w-full">
                    <div
                      onClick={handleSignOut}
                      className="cursor-pointer px-2.5 h-9 text-error border border-transparent hover:bg-error/20 transition-colors duration-500 ease-in-out hover:border-error rounded-lg flex items-center gap-2"
                    >
                      <LogoutIcon />
                      <span className="text-sm">Disconnect Wallet</span>
                    </div>
                  </div>
                </Popover.Content>
              </Popover.Root>
            </div>
          )}
        </div>
      </div>

      <div className="min-[936px]:hidden flex items-center gap-8">
        {isMobileNavOpen ? (
          <CloseIcon
            onClick={() => setIsMobileNavOpen(false)}
            className="text-muted-foreground size-6"
          />
        ) : (
          <MenuIcon
            className="text-muted-foreground"
            onClick={() => setIsMobileNavOpen(true)}
          />
        )}
      </div>
      {isMobileNavOpen && (
        <MobileNav onClose={() => setIsMobileNavOpen(false)} />
      )}
    </nav>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  return (
    <div className="fixed top-[64px] left-0 w-full h-screen flex flex-col items-center bg-background text-primary-foreground z-50">
      <div className="flex flex-col items-center justify-center gap-5 mt-10">
        <TransitionLinks
          href="/profile"
          className={cn(
            "font-medium text-xl text-muted-foreground hover:text-foreground transition-colors duration-300 ease-in-out",
            { "text-foreground": pathname === "/profile" }
          )}
          onClick={onClose}
        >
          Profile
        </TransitionLinks>
        {Nav_Links.map((item) => {
          const { name, link } = item;
          const isActive = pathname === link;

          return (
            <ul key={name} className="flex">
              <li className="flex">
                <TransitionLinks
                  href={link}
                  className={cn(
                    "hover:text-button-hover font-medium text-xl text-muted-foreground",
                    { "text-foreground": isActive }
                  )}
                  onClick={onClose}
                >
                  {name}
                </TransitionLinks>
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}
