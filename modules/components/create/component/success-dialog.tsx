import { Button, Dialog } from "@/modules/app";
import React, { useEffect, useState } from "react";
import { ImageHolder } from "../../home/components/collections-nft-card/collections-nft-card";
import Confetti from "react-confetti";

import Link from "next/link";
import { useWindowSize } from "@uidotdev/usehooks";
import { chainInfo } from "@/utils/configs";
import LinkIcon from "@/assets/link-external-02.svg";
import Eye from "@/assets/eye.svg";

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
              <Button
                // className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300"
                aria-label="View NFT details"
                onClick={onClick}
                shape="square"
              >
                <Eye className="size-5" />
                View NFT Details
              </Button>

              <Link
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground bg-tertiary font-medium hover:bg-tertiary/20 hover:text-foreground transition-all duration-300"
                aria-label="View transaction on blockchain explorer"
                href={`${chainInfo.blockExplorers?.[0].url}/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="size-5" />
                View on Explorer
              </Link>
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
