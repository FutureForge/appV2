import React from "react";
import { cn } from "../../utils";
import Image from "next/image";

type EmptyStateProps = {
  message: string;
  className?: string;
};
export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "w-full !p-4 items-center flex-col gap-10 justify-center flex h-[80vh] max-md:h-[50vh]",
        className
      )}
    >
      <Image src="/Group.svg" alt="Empty state" width={200} height={200} />
      {message}
    </div>
  );
}
