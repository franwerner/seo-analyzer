"use client";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";
import queryClientConfig from "../common/config/queryClient.config";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}



export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter()

  return (
    <HeroUIProvider className="h-full flex flex-col flex-1" navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ToastProvider
        />
        <QueryClientProvider
          client={queryClientConfig()}>
          {children}
        </QueryClientProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
