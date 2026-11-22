import { prisma } from "@/lib/prisma";
import { LogAuditInput } from "@/types/audit";
import { Prisma } from "@prisma/client";

const STRIPPED_KEY_PATTERNS = new Set([
  "password",
  "passwordhash",
  "password_hash",
  "token",
  "tokens",
  "accesstoken",
  "access_token",
  "refreshtoken",
  "refresh_token",
  "id_token",
  "session_state",
  "usn",
  "phone",
]);

/**
 * Recursively strips sensitive keys from payloads prior to audit persistence.
 * Keys like passwordHash, tokens, usn, and phone are deleted entirely.
 */
export function sanitizeForAudit(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForAudit(item));
  }

  if (typeof data === "object") {
    const cleaned: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (STRIPPED_KEY_PATTERNS.has(lowerKey)) {
        // Strip sensitive field completely
        continue;
      }
      cleaned[key] = sanitizeForAudit(value);
    }

    return cleaned;
  }

  return data;
}

/**
 * Records an immutable AuditLog entry.
 * Note: Must NEVER throw into the caller to avoid breaking core business logic.
 */
export async function logAudit(input: LogAuditInput) {
  try {
    const sanitizedBefore = input.before !== undefined ? sanitizeForAudit(input.before) : undefined;
    const sanitizedAfter = input.after !== undefined ? sanitizeForAudit(input.after) : undefined;

    return await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? undefined,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? undefined,
        before: sanitizedBefore ? (sanitizedBefore as Prisma.InputJsonValue) : Prisma.JsonNull,
        after: sanitizedAfter ? (sanitizedAfter as Prisma.InputJsonValue) : Prisma.JsonNull,
        ip: input.ip ?? undefined,
        userAgent: input.userAgent ?? undefined,
      },
    });
  } catch (err) {
    console.error("[AuditService] Failed to record audit log:", err);
    return null;
  }
}

/**
 * Retrieves paginated audit logs for SUPER_ADMIN review.
 */
export async function getAuditLogs(params: { cursor?: string; limit: number }) {
  const { cursor, limit } = params;

  const logs = await prisma.auditLog.findMany({
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const hasMore = logs.length > limit;
  const items = hasMore ? logs.slice(0, limit) : logs;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return {
    logs: items,
    nextCursor,
  };
}
