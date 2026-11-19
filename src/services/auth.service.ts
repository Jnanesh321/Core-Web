import argon2 from "argon2";
import { RoleName } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AuthUser, SignupInput } from "@/types/auth.schema";

// Pre-computed dummy Argon2id hash for constant-time comparison when email is not found
const DUMMY_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzdHJpbmc$1w47dKZZiB96328YwR6p/9QGZ+5ZgqB7+fXbY8A7r6s";

// In-memory rate limiting stub (Note: for production horizontally scaled instances, replace with Upstash/Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

export function resetRateLimits(): void {
  rateLimitMap.clear();
}

/**
 * Hashes a plaintext password using Argon2id algorithm.
 * Never logs passwords or generated hashes.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * Verifies a plaintext password against an Argon2id hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export class EmailAlreadyRegisteredError extends Error {
  constructor(message = "Email is already registered") {
    super(message);
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = "Invalid email or password") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

/**
 * Creates a new user with the default STUDENT role.
 * emailVerified remains null until verified.
 */
export async function createUser(input: SignupInput): Promise<AuthUser> {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existing) {
    throw new EmailAlreadyRegisteredError();
  }

  const passwordHash = await hashPassword(input.password);

  // Ensure STUDENT role exists in the database
  let studentRole = await prisma.role.findUnique({
    where: { name: RoleName.STUDENT },
  });

  if (!studentRole) {
    studentRole = await prisma.role.create({
      data: {
        name: RoleName.STUDENT,
        description: "VCET student with platform access and registration capabilities",
      },
    });
  }

  const newUser = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash,
      roles: {
        create: {
          roleId: studentRole.id,
        },
      },
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    roles: newUser.roles.map((ur) => ur.role.name),
  };
}

/**
 * Verifies credentials using a constant-time style flow.
 * Throws InvalidCredentialsError on either unknown email or incorrect password.
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<AuthUser> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user || !user.passwordHash) {
    // Constant-time-style flow: perform hash comparison against dummy hash to mitigate timing side-channel
    await verifyPassword(password, DUMMY_HASH);
    throw new InvalidCredentialsError();
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    throw new InvalidCredentialsError();
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles.map((ur) => ur.role.name),
  };
}

/**
 * Verification token helper.
 * TODO: Implement automated email delivery via Resend/SMTP in follow-up issue.
 */
export async function createVerificationToken(
  identifier: string,
  token: string,
  expires: Date
) {
  return prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });
}
