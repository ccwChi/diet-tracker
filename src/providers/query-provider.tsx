// src/providers/query-provider.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  hydrate,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

async function fetchPreferences(): Promise<{
  calorieGoal?: number;
  isVegetarian?: boolean;
  language?: string;
  measurementUnit?: string;
  theme?: "light" | "dark" | "system";
}> {
  const res = await fetch("/api/preferences");
  if (!res.ok) throw new Error("無法取得偏好設定");
  return res.json();
}

function PrefetchPreferences() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "authenticated") {
      queryClient.prefetchQuery({
        queryKey: ["preferences"],
        queryFn: fetchPreferences,
      });
    }
  }, [status, queryClient]);

  return null;
}

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      <PrefetchPreferences />
      {children}
    </QueryClientProvider>
  );
}
