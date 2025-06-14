"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

interface AuthUser {
  id: string
  email: string
  role: string
  tenantId: string
  [key: string]: any
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { session, status, user } = useAuth()
  const router = useRouter()
  const typedUser = user as AuthUser | undefined

  useEffect(() => {
    if (status === "loading") return
    if (!session || !typedUser) {
      router.replace("/login")
      return
    }
    if (allowedRoles && !allowedRoles.includes(typedUser.role)) {
      router.replace("/error/unauthorized")
    }
  }, [session, status, typedUser, allowedRoles, router])

  if (status === "loading" || !session || !typedUser) {
    return <div className="p-4 text-center">Checking authentication...</div>
  }
  if (allowedRoles && !allowedRoles.includes(typedUser.role)) {
    return <div className="p-4 text-center text-red-600">Unauthorized</div>
  }
  return <>{children}</>
} 