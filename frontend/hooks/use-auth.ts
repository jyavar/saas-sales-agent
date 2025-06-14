"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useCallback } from "react"

export function useAuth() {
  const { data: session, status } = useSession()

  const login = useCallback((email: string, password: string) => {
    return signIn("credentials", { email, password, redirect: false })
  }, [])

  const logout = useCallback(() => {
    return signOut({ redirect: false })
  }, [])

  return {
    session,
    status,
    user: session?.user,
    login,
    logout,
    signIn,
    signOut,
  }
}
