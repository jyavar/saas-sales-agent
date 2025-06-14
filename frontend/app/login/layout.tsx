import type { ReactNode } from "react";
import { NextAuthSessionProvider } from "@/components/NextAuthSessionProvider";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
} 