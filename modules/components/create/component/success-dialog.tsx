import { Dialog } from "@/modules/app";
import React, { useEffect, useState } from "react";
import { ImageHolder } from "../../home/components/collections-nft-card/collections-nft-card";
import Confetti from "react-confetti";

import Link from "next/link";
import { useWindowSize } from "@uidotdev/usehooks";

type SuccessDialogProps = {
  src: string;
  name: string;
  Links?: { icon: React.ReactNode; link: string }[];
};

export function SuccessDialog({ src, name, Links }: SuccessDialogProps) {
  const [showConfetti, setShowConfetti] = useState(false);
   const { width =800, height=800} = useWindowSize() ?? {};

  useEffect(() => {
    setShowConfetti(true);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {showConfetti && (
        <Confetti
          // @ts-ignore
          width={width}
          // @ts-ignore
          height={height}
          numberOfPieces={200}
          colors={["#FFD700", "#FF4500", "#1E90FF", "#32CD32"]}
        />
      )}
      <Dialog.Header>
        <p className="font-medium text-pry-text">NFT Created</p>
      </Dialog.Header>
      <Dialog.Body>
        <div className="flex flex-col gap-6 items-center">
          <div className="max-w-[236px] max-h-[200px] w-full h-full">
            <ImageHolder src={src} alt={name} />
          </div>

          <p className="text-pry-text mt-4">
            You Created <span className="text-primary">{name}</span>
          </p>

          {Links && (
            <div className="flex flex-col gap-2 items-center">
              <p className="text-muted-foreground">Share to</p>
              <div className="flex items-center justify-center gap-4">
                {Links?.map(({ icon, link }, index) => (
                  <Link
                    href={link}
                    key={`social-links-key-${index}`}
                    aria-label={`Share on ${link}`}
                  >
                    <div className="size-4 text-muted-foreground hover:text-pry-text transition-all duration-300 ease-in-out">
                      {icon}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Dialog.Body>
    </>
  );
}
