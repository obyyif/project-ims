"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import AttendanceSheet from "./components/AttendanceSheet";
import UploadMaterialSheet from "./components/UploadMaterialSheet";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AttendanceSheet />
      <UploadMaterialSheet />
    </AuthProvider>
  );
}
