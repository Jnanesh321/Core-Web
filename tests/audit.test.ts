import { describe, it, expect, beforeEach, vi } from "vitest";
import { sanitizeForAudit, logAudit } from "@/services/audit.service";
import { AuditActions } from "@/types/audit";
import { GET as auditLogsHandler } from "@/app/api/admin/audit-logs/route";
import { getServerSession } from "next-auth";
import { RoleName } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

vi.mock("next-auth", async () => {
  const actual = await vi.importActual("next-auth");
  return {
    ...actual,
    getServerSession: vi.fn(),
  };
});

describe("Audit Logging System", () => {
  describe("sanitizeForAudit", () => {
    it("strips passwordHash, tokens, usn, and phone from nested objects", () => {
      const rawPayload = {
        name: "Jnanesh",
        email: "jnanesh@vcet.edu.in",
        passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$secret",
        token: "session-secret-jwt-token",
        usn: "4VP21CS001",
        phone: "+919876543210",
        profile: {
          department: "CSE",
          phone: "9876543210",
          nestedTokens: {
            refreshToken: "refresh-secret",
            publicInfo: "ok",
          },
        },
      };

      const sanitized = sanitizeForAudit(rawPayload) as any;

      expect(sanitized.name).toBe("Jnanesh");
      expect(sanitized.email).toBe("jnanesh@vcet.edu.in");
      expect(sanitized.passwordHash).toBeUndefined();
      expect(sanitized.token).toBeUndefined();
      expect(sanitized.usn).toBeUndefined();
      expect(sanitized.phone).toBeUndefined();
      expect(sanitized.profile.department).toBe("CSE");
      expect(sanitized.profile.phone).toBeUndefined();
      expect(sanitized.profile.nestedTokens.refreshToken).toBeUndefined();
      expect(sanitized.profile.nestedTokens.publicInfo).toBe("ok");

      // Verify serialized JSON never contains sensitive keys
      const jsonString = JSON.stringify(sanitized);
      expect(jsonString).not.toContain("passwordHash");
      expect(jsonString).not.toContain("4VP21CS001");
      expect(jsonString).not.toContain("+919876543210");
      expect(jsonString).not.toContain("session-secret-jwt-token");
    });

    it("handles arrays and null values", () => {
      expect(sanitizeForAudit(null)).toBeNull();
      const list = [{ usn: "4VP21CS001", name: "Alice" }, { phone: "12345", name: "Bob" }];
      const sanitized = sanitizeForAudit(list) as any[];
      expect(sanitized[0].usn).toBeUndefined();
      expect(sanitized[0].name).toBe("Alice");
      expect(sanitized[1].phone).toBeUndefined();
      expect(sanitized[1].name).toBe("Bob");
    });
  });

  describe("logAudit", () => {
    it("persists audit row in database and catches errors without throwing", async () => {
      const log = await logAudit({
        action: AuditActions.SETTING_CHANGED,
        entity: "SiteSetting",
        entityId: "setting-1",
        before: { key: "site_name", value: "Old Site", passwordHash: "secret" },
        after: { key: "site_name", value: "CoRE Official", usn: "4VP21CS001" },
        ip: "127.0.0.1",
      });

      expect(log).not.toBeNull();
      expect(log?.id).toBeDefined();
      expect(log?.action).toBe("SETTING_CHANGED");

      // Verify row in database
      const row = await prisma.auditLog.findUnique({
        where: { id: log!.id },
      });
      expect(row).toBeDefined();
      const storedBefore = row?.before as any;
      const storedAfter = row?.after as any;

      expect(storedBefore.passwordHash).toBeUndefined();
      expect(storedBefore.value).toBe("Old Site");
      expect(storedAfter.usn).toBeUndefined();
      expect(storedAfter.value).toBe("CoRE Official");
    });
  });

  describe("GET /api/admin/audit-logs Route", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("returns 401 when unauthenticated", async () => {
      vi.mocked(getServerSession).mockResolvedValue(null);
      const req = new NextRequest("http://localhost:3000/api/admin/audit-logs");
      const res = await auditLogsHandler(req);
      expect(res.status).toBe(401);
    });

    it("returns 403 when authenticated as ADMIN (only SUPER_ADMIN allowed)", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "admin-user",
          email: "admin@vcet.edu.in",
          roles: [RoleName.ADMIN],
        },
        expires: "2099-01-01",
      });

      const req = new NextRequest("http://localhost:3000/api/admin/audit-logs");
      const res = await auditLogsHandler(req);
      expect(res.status).toBe(403);
    });

    it("returns 200 with logs when authenticated as SUPER_ADMIN", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "superadmin-user",
          email: "superadmin@vcet.edu.in",
          roles: [RoleName.SUPER_ADMIN],
        },
        expires: "2099-01-01",
      });

      const req = new NextRequest("http://localhost:3000/api/admin/audit-logs?limit=10");
      const res = await auditLogsHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(Array.isArray(json.logs)).toBe(true);
    });

    it("returns 400 for invalid query parameters (e.g. limit > 100)", async () => {
      vi.mocked(getServerSession).mockResolvedValue({
        user: {
          id: "superadmin-user",
          email: "superadmin@vcet.edu.in",
          roles: [RoleName.SUPER_ADMIN],
        },
        expires: "2099-01-01",
      });

      const req = new NextRequest("http://localhost:3000/api/admin/audit-logs?limit=500");
      const res = await auditLogsHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Invalid query parameters");
    });
  });
});
