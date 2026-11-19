import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { RoleName } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyCredentials } from "@/services/auth.service";
import { AuthUser, loginSchema } from "@/types/auth.schema";

/**
 * Authentication Architecture & Session Strategy Rationale:
 * We use the JWT session strategy (`strategy: "jwt"`).
 * Rationale:
 * 1. Low latency: JWT eliminates redundant database session lookups on every incoming request.
 * 2. Role embedding: Verified user roles are embedded in the cryptographically signed JWT token,
 *    enabling fast, server-side RBAC guard verification.
 * 3. Security: The session cookie is configured as HttpOnly, SameSite=Lax, and Secure in production.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@vcet.edu.in" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        try {
          const user = await verifyCredentials(parsed.data.email, parsed.data.password);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
          };
        } catch {
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as AuthUser).roles ?? [RoleName.STUDENT];
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as RoleName[]) ?? [RoleName.STUDENT];
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export class AuthError extends Error {
  statusCode: number;
  constructor(message = "Unauthorized", statusCode = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

/**
 * Returns the current authenticated user or null.
 * Never exposes sensitive student profile data (usn, phone).
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
    roles: session.user.roles ?? [],
  };
}

/**
 * Asserts that the request is authenticated.
 * Throws AuthError(401) if no active session exists.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Authentication required", 401);
  }
  return user;
}
