import React from "react";
import { Button } from "..";
import { useRouter } from "next/router";
import Head from "next/head";
import { cn } from "@/modules/app/utils";

type ErrorComponentProps = {
  className?: string;
  message?: string;
};

export function ErrorComponent({ className, message }: ErrorComponentProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className={cn("w-full flex items-center justify-center", className)}>
      <Head>
        <title>404: This page was not found.</title>
      </Head>
      <div className="flex items-center justify-center flex-col gap-4">
        <div className="max-h-[130px] flex gap-2 w-fit">
          <h1 className="text-muted-foreground font-medium text-8xl">404</h1>
        </div>

        <div className="text-center flex flex-col items-center justify-center w-full gap-4">
          <div className="flex items-center flex-col gap-2">
            <p className="text-lg text-muted-foreground font-bold flex items-center gap-1">
              {message || "Something gone "}
              <span className="uppercase text-pry-text">
                {message ? "WRONG!" : "wrong!"}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 w-full">
            <Button
              variant="secondary"
              shape="square"
              onClick={handleGoBack}
              className="bg-background font-semibold"
            >
              Go Back
            </Button>
            <Button
              shape="square"
              onClick={handleHome}
              className="font-semibold"
            >
              Take me Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
