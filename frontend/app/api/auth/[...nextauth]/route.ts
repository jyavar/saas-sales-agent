import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";
import { cookies } from "next/headers";

interface DecodedToken {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
  [key: string]: any;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data?.token) return null;
        // Attach token to user object
        return { ...data, token: data.token };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, decode JWT and attach info
      if (user && (user as any).token) {
        const decoded = jwtDecode<DecodedToken>((user as any).token);
        token.id = decoded.userId;
        token.tenantId = decoded.tenantId;
        token.role = decoded.role;
        token.email = decoded.email;
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any) = {
        id: token.id as string | undefined,
        email: token.email as string | undefined,
        role: token.role as string | undefined,
        tenantId: token.tenantId as string | undefined,
      };
      (session as any).accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 