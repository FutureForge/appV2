import React, { ReactNode } from "react";
import { cn } from "../../utils";
import Info from "@/assets/info.svg";
import Check from "@/assets/select-box-circle-fill.svg";

type CustomToastProps = {
  title: string;
  description: ReactNode;
  actions?: React.ReactNode;
  close: () => void;
  status: "success" | "error" | "warning" | "info" | "loading";
  isSucess?: boolean;
  isError?: boolean;
};

export const CustomToast = ({
  title,
  description,
  actions,
  status,
  close,
}: CustomToastProps) => {
  return (
    <div className="relative bg-card shadow-elements rounded-xl flex p-4 border border-border min-w-[360px]">
      <div className="flex gap-3 items-start">
        {status === "success" && <Check className="size-4" />}
        {status === "error" && <Info className="size-4 text-error" />}
        <div className="flex flex-col items-start justify-between">
          <span className="flex items-center justify-between">
            <h1 className="select-none text-pry-text font-medium -mt-1">
              {title}
            </h1>
            {actions}
          </span>
          {description && (
            <p className="text-muted-foreground text-sm font-sans mt-2 select-none">
              {description}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={close}
        className="absolute size-5 p-1 hover:bg-new-elements hover:text-new-foreground duration-150 ease-out text-muted-foreground right-3 top-3"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 18 18"
        >
          <g
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <line x1="14" y1="4" x2="4" y2="14"></line>
            <line x1="4" y1="4" x2="14" y2="14"></line>
          </g>
        </svg>
      </button>
    </div>
  );
};
