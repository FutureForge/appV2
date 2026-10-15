import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Label, TextField } from "@/modules/app";

const CORRECT_PASSWORD = "oojosepH@67";
const AUTH_KEY = "add-collection-authed";

export function AddCollectionPasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthed = window.localStorage.getItem(AUTH_KEY) === "true";
      setAuthenticated(isAuthed);
    }
    setMounted(true);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      window.localStorage.setItem(AUTH_KEY, "true");
      setAuthenticated(true);
    } else {
      router.push("/");
    }
  };

  if (!mounted) return null;

  if (authenticated) return <>{children}</>;

  return (
    <div className="flex flex-col gap-6 max-[1095px]:py-12 max-[1095px]:px-4 max-sm:h-screen max-sm:mt-[15vh]">
      <div className="flex flex-col gap-2">
        <h4 className="font-medium md:text-xl text-lg min-[1170px]:text-[28px]">
          Restricted Access
        </h4>
        <p className="text-muted-foreground max-md:text-sm">
          Enter the password to add a collection
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[504px] max-[1095px]:w-full max-w-full"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="collection-password">Password</Label>
          <TextField
            id="collection-password"
            name="collection-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            containerClass="bg-border border-0"
            autoFocus
          />
        </div>
        <Button type="submit" shape="square" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
