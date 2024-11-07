// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { ReactNode, useEffect, useState } from "react";

// type TransitionLinksProps = {
//   children: ReactNode;
//   href: string;
//   className?: string;
// };

// function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export function TransitionLinks({
//   children,
//   href,
//   className,
//   ...props
// }: TransitionLinksProps) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleTransition = async (
//     e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
//   ) => {
//     e.preventDefault();

//     // const body = document.querySelector("body");
//     // body?.classList.add("page-transition");
//     setLoading(true);
//     await sleep(500);
//     router.push(href);

//     await sleep(500);
//     setLoading(false);
//     // body?.classList.remove("page-transition");
//   };

//   useEffect(() => {
//     if (loading) {
//       document.body.style.overflow = "hidden"; // Disable scrolling
//     } else {
//       document.body.style.overflow = "auto"; // Re-enable scrolling
//     }

//     // Cleanup function to reset overflow in case the component unmounts while loading
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [loading]);

//   return (
//     <div>
//       <Link
//         onClick={handleTransition}
//         href={href}
//         className={className}
//         {...props}
//       >
//         {children}
//       </Link>
//       {loading && (
//         <div className="fixed h-screen bg-white left-0 right-0 top-0 opacity-70 backdrop-blur-xl text-black flex w-full z-20 items-center justify-center">
//           Loading...
//         </div>
//       )}{" "}
//     </div>
//   );
// }
"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

type TransitionLinksProps = {
  children: ReactNode;
  href: string;
  className?: string;
};

export function TransitionLinks({
  children,
  href,
  className,
  ...props
}: TransitionLinksProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Reset transition state when pathname changes
    setIsTransitioning(false);
  }, [pathname]);

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (href === pathname) return;

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
        <div className="fixed inset-0 bg-background/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out z-50 flex items-center justify-center">
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
