import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createUser,
  verifyCredentials,
  hashPassword,
  verifyPassword,
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  checkRateLimit,
  resetRateLimits,
} from "@/services/auth.service";
import { RoleName } from "@prisma/client";

describe("Auth Service & Argon2id Security", () => {
  beforeEach(async () => {
    resetRateLimits();
    // Clean up test users
    await prisma.user.deleteMany({
      where: { email: { in: ["test-auth@vcet.edu.in", "test-auth2@vcet.edu.in"] } },
    });
  });

  it("hashes password with Argon2id ($argon2id$ prefix)", async () => {
    const rawPassword = "securePassword123!";
    const hash = await hashPassword(rawPassword);

    expect(hash.startsWith("$argon2id$")).toBe(true);
    const valid = await verifyPassword(rawPassword, hash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword("wrongPassword", hash);
    expect(invalid).toBe(false);
  });

  it("creates a user with default STUDENT role and hashed password", async () => {
    const user = await createUser({
      name: "Jnanesh Test",
      email: "test-auth@vcet.edu.in",
      password: "strongPassword123",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test-auth@vcet.edu.in");
    expect(user.name).toBe("Jnanesh Test");
    expect(user.roles).toContain(RoleName.STUDENT);

    // Verify raw DB password entry starts with $argon2id$ and does not store plaintext
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    expect(dbUser?.passwordHash?.startsWith("$argon2id$")).toBe(true);
    expect(dbUser?.passwordHash).not.toContain("strongPassword123");
  });

  it("rejects duplicate email with EmailAlreadyRegisteredError", async () => {
    await createUser({
      name: "First User",
      email: "test-auth@vcet.edu.in",
      password: "strongPassword123",
    });

    await expect(
      createUser({
        name: "Second User",
        email: "test-auth@vcet.edu.in",
        password: "anotherPassword123",
      })
    ).rejects.toThrow(EmailAlreadyRegisteredError);
  });

  it("verifies credentials correctly and rejects wrong passwords with constant-time error", async () => {
    await createUser({
      name: "Jnanesh Test",
      email: "test-auth@vcet.edu.in",
      password: "strongPassword123",
    });

    const user = await verifyCredentials("test-auth@vcet.edu.in", "strongPassword123");
    expect(user.email).toBe("test-auth@vcet.edu.in");
    expect(user.roles).toContain(RoleName.STUDENT);

    // Wrong password
    await expect(
      verifyCredentials("test-auth@vcet.edu.in", "wrongPassword123")
    ).rejects.toThrow(InvalidCredentialsError);

    // Non-existent email
    await expect(
      verifyCredentials("unknown@vcet.edu.in", "somePassword123")
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it("enforces in-memory rate limiting stub", () => {
    const testKey = "test-ip";
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(testKey, 3, 10000)).toBe(true);
    }
    // 4th request exceeds limit of 3
    expect(checkRateLimit(testKey, 3, 10000)).toBe(false);
  });
});
