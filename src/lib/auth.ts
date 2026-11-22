import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { RoleName } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyCredentials } from "@/services/auth.service";
import { AuthUser, loginSchema } from "@/types/auth.schema";
import { hasAllRoles, hasAnyRole, hasRole } from "@/lib/permissions";

export { hasRole, hasAnyRole, hasAllRoles };

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

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message = "Forbidden: Insufficient permissions", statusCode = 403) {
    super(message);
    this.name = "ForbiddenError";
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

/**
 * Asserts that the user possesses all required roles (or implied by hierarchy).
 * Returns user if authorized; throws AuthError(401) or ForbiddenError(403).
 */
export async function requireRole(...roles: RoleName[]): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasAllRoles(user.roles, roles)) {
    throw new ForbiddenError(
      `Forbidden: Missing required role(s): ${roles.join(", ")}`
    );
  }
  return user;
}

/**
 * Asserts that the user possesses at least one of the specified roles (or implied by hierarchy).
 * Returns user if authorized; throws AuthError(401) or ForbiddenError(403).
 */
export async function requireAnyRole(...roles: RoleName[]): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasAnyRole(user.roles, roles)) {
    throw new ForbiddenError(
      `Forbidden: Requires at least one role of: ${roles.join(", ")}`
    );
  }
  return user;
}

/**
 * Asserts that the user is an organizer of the specified event, or is ADMIN / SUPER_ADMIN.
 * Otherwise throws ForbiddenError(403).
 */
export async function requireEventOrganizer(eventId: string): Promise<AuthUser> {
  const user = await requireAuth();

  // ADMIN and SUPER_ADMIN have implicit management rights
  if (hasRole(user.roles, RoleName.ADMIN)) {
    return user;
  }

  const organizer = await prisma.eventOrganizer.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId: user.id,
      },
    },
  });

  if (!organizer) {
    throw new ForbiddenError("Forbidden: You are not an organizer for this event");
  }

  return user;
}

/**
 * Asserts that the authenticated user is the owner of the resource or an ADMIN+.
 * Otherwise throws ForbiddenError(403).
 */
export async function requireOwnerOrAdmin(ownerUserId: string): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.id === ownerUserId || hasRole(user.roles, RoleName.ADMIN)) {
    return user;
  }

  throw new ForbiddenError("Forbidden: Only the owner or an administrator can modify this resource");
}
