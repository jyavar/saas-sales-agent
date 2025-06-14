"use client";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

export function NextAuthSessionProvider({ children, session }: { children: ReactNode, session?: Session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
} 