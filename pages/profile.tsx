import { ProfilePage } from "@/modules/components/profile";
import { HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export default function Profile() {
  return (
    <HydrationBoundary>
      <div suppressHydrationWarning className="mt-20 w-full min-h-screen px-4">
        <ProfilePage />
      </div>
    </HydrationBoundary>
  );
}
