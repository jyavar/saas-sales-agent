import { getSession } from "next-auth/react"
import type { Session } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

/**
 * Wrapper para fetch que inyecta el token JWT de NextAuth en Authorization.
 */
export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const session = await getSession();
  const headers = new Headers(init.headers);
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }
  return fetch(input, { ...init, headers });
} 