"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { useDisableScroll } from "../../hooks/useDisableScroll";

type TransitionLinksProps = {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function TransitionLinks({
  children,
  href,
  className,
  onClick,
  ...props
}: TransitionLinksProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  useDisableScroll(isTransitioning);
  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (href === pathname) return;

    
    if (onClick) {
      onClick(e);
    }

    setIsTransitioning(true);

    router.push(href);
  };

  return (
    <>
      <Link
        onClick={handleTransition}
        href={href}
        className={className}
        {...props}
      >
        {children}
      </Link>
      {isTransitioning && (
        <div className="fixed inset-0 bg-background/30 h-screen backdrop-blur-sm transition-opacity duration-300 ease-in-out z-[999] flex items-center justify-center">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={50}
            height={50}
            className="pulsating-logo"
          />
        </div>
      )}
    </>
  );
}
