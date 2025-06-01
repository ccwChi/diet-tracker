"use client";

import { Spinner } from "@/components/spinnner";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import React, { useEffect, useState, useTransition } from "react";
import Navigation from "@/components/ui/sidebar-abandon/leftbar";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/ui/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isPending, startTransition] = useTransition();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <Sidebar />
      <main
        className={cn(
          "flex-1 h-full overflow-y-auto",
          isClient && isMobile && "hide-scrollbar"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
