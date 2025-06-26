"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider
      // Adiciona configurações opcionais
      refetchInterval={5 * 60} // Refetch a cada 5 minutos
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
