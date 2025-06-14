"use client";
import { useAuth } from "@/hooks/use-auth";

export const LogoutButton = () => {
  const { logout, status } = useAuth();
  return (
    <button className="btn btn-ghost" onClick={() => logout()} disabled={status === "loading"}>
      Cerrar sesión
    </button>
  );
}; 