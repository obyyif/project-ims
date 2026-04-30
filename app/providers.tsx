"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>{children}</AuthProvider>
    </ErrorBoundary>
  );
}
