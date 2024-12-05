import { Dialog } from "@/modules/app";
import React, { useEffect, useState } from "react";
import { ImageHolder } from "../../home/components/collections-nft-card/collections-nft-card";
import Confetti from "react-confetti";

import Link from "next/link";
import { useWindowSize } from "@uidotdev/usehooks";
import { chainInfo } from "@/utils/configs";

type SuccessDialogProps = {
  src: string;
  name: string;
  Links?: { icon: React.ReactNode; link: string }[];
  onClick?: () => void;
  transactionHash?: string;
};

export function SuccessDialog({
  src,
  name,
  Links,
  onClick,
  transactionHash,
}: SuccessDialogProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const { width = 800, height = 800 } = useWindowSize() ?? {};

  useEffect(() => {
    if (src.startsWith("blob:")) {
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImageSrc(reader.result as string);
          };
          reader.readAsDataURL(blob);
        })
        .catch((err) => console.error("Error converting blob URL:", err));
    }
  }, [src]);

  useEffect(() => {
    setShowConfetti(true);
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
            <ImageHolder src={imageSrc} alt={name} />
          </div>

          <p className="text-pry-text mt-4">
            NFT <span className="text-primary">{name}</span> Created
          </p>

          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center justify-center gap-4">
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300"
                aria-label="View NFT details"
                onClick={onClick}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="size-5 text-primary" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
                </svg>
                <p className="text-primary font-medium">View NFT Details</p>
              </button>

              <a
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300"
                aria-label="View transaction on blockchain explorer"
                href={`${chainInfo.blockExplorers?.[0].url}/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="size-5 text-primary" 
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M13.5 10.5L21 3" />
                  <path d="M16 3h5v5" />
                  <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                </svg>
                <p className="text-primary font-medium">View on Explorer</p>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your NFT has been minted successfully on the blockchain
            </p>
          </div>
        </div>
      </Dialog.Body>
    </>
  );
}
